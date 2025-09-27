import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SplashPage = async () => {
  const getSlug = (await cookies()).get("slug")?.value;
  const getId = (await cookies()).get("id")?.value;
  const domain = (await cookies()).get("domain")?.value;

  if (getSlug && getId) {
    if (domain) {
      redirect(
        `/api/redirect-with-cleanup?domain=${encodeURIComponent(
          domain
        )}&slug=${encodeURIComponent(getSlug)}&id=${encodeURIComponent(getId)}`
      );
    } else {
      redirect(`/@${getSlug}/${getId}`);
    }
  } else {
    redirect("/home");
  }
};

export default SplashPage;
