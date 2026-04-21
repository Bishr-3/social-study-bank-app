import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "الرجاء إضافة مفتاح Gemini API في ملف الإعدادات (.env.local)" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";

    switch (action) {
      case "summarize":
        prompt = `قُم بتلخيص النص التالي بأسلوب تعليمي منظم وواضح للطالب العربي، استخدم النقاط الأساسية والعناوين الجانبية:\n\n${payload}`;
        break;
      case "fix-homework":
        prompt = `أنت معلم خبير، قُم بمراجعة هذه الإجابة أو السؤال التالي، وضّح الأخطاء (إن وجدت) وقدم الحل الصحيح مع شرح مبسط:\n\n${payload}`;
        break;
      case "study-plan":
        prompt = `صمم جدولاً دراسياً (Study Plan) بناءً على المدخلات التالية: ${payload}. اجعل الجدول منظماً جداً (مثلاً: اليوم، المادة، وقت الدراسة، الهدف).`;
        break;
      default:
        return NextResponse.json({ error: "الإجراء غير مدعوم" }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب الذكي." },
      { status: 500 }
    );
  }
}
