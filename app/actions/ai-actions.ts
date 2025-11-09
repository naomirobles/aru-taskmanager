// app/actions/ai_actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { openrouter } from "@/lib/openrouter";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type Recommendation = {
  title: string;
  link: string;
  type?: string;
};

export async function generateRecommendations(taskId: string, taskTitle: string, taskDescription?: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "No autorizado" };
    }

    // Verificar que la tarea pertenece al usuario
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: { user_id: true },
    });

    if (!task || task.user_id !== userId) {
      return { error: "Tarea no encontrada" };
    }

    // Construir el contexto para la IA
    const context = taskDescription 
      ? `Título: ${taskTitle}\nDescripción: ${taskDescription}`
      : `Título: ${taskTitle}`;

    const prompt = `Realiza una búsqueda en línea de fuentes confiables (artículos académicos, libros, vídeos de YouTube con buena reputación) sobre: ${context}

Selecciona **exactamente 3** hipervínculos que aporten valor (pueden ser vídeos de YouTube o artículos/referencias bibliográficas).

Asegúrate de que los enlaces funcionen y apunten a la fuente real (no enlaces genéricos, ni páginas de error).

Para cada recurso, identifica el tipo:
- "video" si es un video de YouTube
- "article" si es un artículo web o blog
- "academic" si es un paper académico o libro

Devuelve un arreglo JSON con la siguiente estructura (y **solo** eso, sin explicación adicional):
[
  {
    "title": "Título del recurso 1",
    "link": "https://...",
    "type": "video" | "article" | "academic"
  },
  {
    "title": "Título del recurso 2",
    "link": "https://...",
    "type": "video" | "article" | "academic"
  },
  {
    "title": "Título del recurso 3",
    "link": "https://...",
    "type": "video" | "article" | "academic"
  }
]`;

    // Llamar a OpenRouter con un modelo que soporte búsqueda web
    const completion = await openrouter.chat.completions.create({
      model: "perplexity/sonar", // Modelo con acceso a búsqueda web
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return { error: "No se pudo generar recomendaciones" };
    }

    // Parsear el JSON
    let recommendations: Recommendation[];
    try {
      // Limpiar el response en caso de que tenga markdown code blocks
      const cleanedResponse = responseContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      recommendations = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Response content:", responseContent);
      return { error: "Error al procesar las recomendaciones" };
    }

    // Validar que tenemos un array con al menos 1 recomendación
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return { error: "Formato de recomendaciones inválido" };
    }

    // Tomar solo las primeras 3 recomendaciones
    const validRecommendations = recommendations.slice(0, 3);

    // Función helper para extraer el source del URL
    const extractSource = (url: string): string => {
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
          return 'YouTube';
        } else if (hostname.includes('wikipedia.org')) {
          return 'Wikipedia';
        } else if (hostname.includes('arxiv.org')) {
          return 'arXiv';
        } else if (hostname.includes('scholar.google')) {
          return 'Google Scholar';
        } else if (hostname.includes('medium.com')) {
          return 'Medium';
        } else {
          // Capitalizar primera letra del dominio
          return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
        }
      } catch {
        return 'Web';
      }
    };

    // Función helper para extraer thumbnail de YouTube
    const extractYoutubeThumbnail = (url: string): string | null => {
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
          const videoId = urlObj.searchParams.get('v');
          if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          }
        } else if (urlObj.hostname.includes('youtu.be')) {
          const videoId = urlObj.pathname.slice(1);
          if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
          }
        }
      } catch {
        return null;
      }
      return null;
    };

    // Guardar las recomendaciones en la base de datos
    const savedRecommendations = await Promise.all(
      validRecommendations.map((rec) => {
        const source = extractSource(rec.link);
        const thumbnailUrl = rec.type === 'video' ? extractYoutubeThumbnail(rec.link) : null;
        
        return db.savedRecommendation.create({
          data: {
            task_id: taskId,
            user_id: userId,
            title: rec.title,
            url: rec.link,
            type: rec.type || 'article',
            source: source,
            thumbnail_url: thumbnailUrl,
          },
        });
      })
    );

    revalidatePath("/");

    return { 
      success: true, 
      recommendations: savedRecommendations,
    };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return { error: "Error al generar recomendaciones con IA" };
  }
}