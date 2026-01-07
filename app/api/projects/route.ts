import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../lib/db";

// APIルートの設定（タイムアウト設定）
// Vercelなどのホスティング環境では、環境変数VERCEL_FUNCTION_TIMEOUTで設定可能
export const maxDuration = 30; // 30秒（Vercel Proプラン以上で有効）

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得（エラーハンドリングを改善）
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "リクエストデータの形式が正しくありません" },
        { status: 400 }
      );
    }

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

    // リクエストボディのサイズチェック（画像URLが多すぎる場合）
    const requestBodySize = JSON.stringify(body).length;
    if (requestBodySize > 1024 * 1024) { // 1MB以上の場合
      console.warn(`Large request body detected: ${requestBodySize} bytes`);
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
        // 編み図を1つずつ挿入（エラーハンドリングを改善）
        for (let index = 0; index < validPatternImages.length; index++) {
          try {
            await sql`
              INSERT INTO patterns (project_id, image_url, display_order)
              VALUES (${project.id}, ${validPatternImages[index]}, ${index})
            `;
          } catch (patternError) {
            console.error(`Error inserting pattern ${index}:`, patternError);
            // 個別の編み図の挿入エラーはログに記録するが、処理は続行
            // （一部の編み図が登録できない場合でも、作品自体は登録される）
          }
        }
      }
    }

    return NextResponse.json({ id: project.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    // エラーの詳細をログに記録
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    
    return NextResponse.json(
      { 
        error: "作品の登録に失敗しました",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

