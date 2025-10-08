import { useEffect } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

export const useInfiniteScroll = (callback: () => void) => {
    const { isIntersecting, ref } = useIntersectionObserver({
        threshold: 1,
    })

    useEffect(() => {
        if (isIntersecting) {
            callback();
        };
    }, [isIntersecting, callback]);

    return ref;
}