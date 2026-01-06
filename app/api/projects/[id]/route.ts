import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

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

    // 作品を更新
    await sql`
      UPDATE projects
      SET 
        title = ${title},
        description = ${description || null},
        completed_image_url = ${completed_image_url || null},
        youtube_url = ${youtube_url || null},
        yarn_color_count = ${yarn_color_count}
      WHERE id = ${projectId}
    `;

    // 既存の編み図を削除
    await sql`DELETE FROM patterns WHERE project_id = ${projectId}`;

    // 新しい編み図を追加
    if (pattern_images && Array.isArray(pattern_images)) {
      const validPatternImages = pattern_images.filter(
        (url: string) => url && url.trim() !== ""
      );

      if (validPatternImages.length > 0) {
        for (let index = 0; index < validPatternImages.length; index++) {
          await sql`
            INSERT INTO patterns (project_id, image_url, display_order)
            VALUES (${projectId}, ${validPatternImages[index]}, ${index})
          `;
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "作品の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // 作品を削除（編み図はCASCADEで自動削除される）
    await sql`DELETE FROM projects WHERE id = ${projectId}`;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "作品の削除に失敗しました" },
      { status: 500 }
    );
  }
}

