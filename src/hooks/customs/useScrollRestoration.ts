import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function useScrollRestoration() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const url = `${pathname}?${searchParams}`;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const beforeUnloadHandler = () => sessionStorage.clear();

            window.addEventListener("beforeunload", beforeUnloadHandler);

            if ("history" in window && "scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }

            const scrollY = sessionStorage.getItem(url);

            !isNaN(+scrollY!) && window.scrollTo(0, +scrollY!);

            return () => {
                window.removeEventListener("beforeunload", beforeUnloadHandler);
            };
        }
    }, [url]);

    useEffect(() => {
        let scrollTimeout: number | undefined;

        const scrollHandler = () => {
            scrollTimeout && clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => {
                sessionStorage.setItem(url, window.scrollY.toString());
            }, 30);
        };

        const scrollEndHandler = () => {
            sessionStorage.setItem(url, window.scrollY.toString());
        };

        const controller = new AbortController();
        if ("onscrollend" in window) {
            // Browser supports scrollend
            document.addEventListener("scrollend", scrollEndHandler, {
                signal: controller.signal,
            });
        } else {
            // Polyfill for browsers that don't support scrollend
            document.addEventListener("scroll", scrollHandler, {
                signal: controller.signal,
            });
        }

        return () => {
            controller.abort();
            scrollTimeout && clearTimeout(scrollTimeout);
        };
    }, [url]);
}