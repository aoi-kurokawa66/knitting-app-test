import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      completed_image_url,
      youtube_url,
      yarn_color_count,
      pattern_images,
    } = body;

    // バリデーション
    if (!title || typeof yarn_color_count !== "number") {
      return NextResponse.json(
        { error: "タイトルと糸の色の数は必須です" },
        { status: 400 }
      );
    }

    // 作品を作成
    const [project] = await sql`
      INSERT INTO projects (title, description, completed_image_url, youtube_url, yarn_color_count)
      VALUES (${title}, ${description || null}, ${completed_image_url || null}, ${youtube_url || null}, ${yarn_color_count})
      RETURNING *
    `;

    // 編み図を追加
    if (pattern_images && Array.isArray(pattern_images)) {
      const validPatternImages = pattern_images.filter(
        (url: string) => url && url.trim() !== ""
      );

      if (validPatternImages.length > 0) {
        // 編み図を1つずつ挿入
        for (let index = 0; index < validPatternImages.length; index++) {
          await sql`
            INSERT INTO patterns (project_id, image_url, display_order)
            VALUES (${project.id}, ${validPatternImages[index]}, ${index})
          `;
        }
      }
    }

    return NextResponse.json({ id: project.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "作品の登録に失敗しました" },
      { status: 500 }
    );
  }
}

