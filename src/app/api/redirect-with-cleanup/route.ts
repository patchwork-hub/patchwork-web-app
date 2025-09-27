import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");

  if (!domain || !slug) {
    redirect("/home");
  }

  const cookieStore = await cookies();
  cookieStore.delete("slug");
  cookieStore.delete("id");

  redirect(`https://${domain}/search?q=https://patchwork.io/@${slug}/${id}`);
}
