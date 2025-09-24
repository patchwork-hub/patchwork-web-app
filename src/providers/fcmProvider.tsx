'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFCM } from "@/hooks/fcm/useFCM";
import { DEFAULT_API_URL } from "@/utils/constant";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { useSaveFCMToken } from "@/hooks/mutations/fcm/useSaveFCMToken";
import { getToken } from "@/lib/auth";

export const FCMProvider = ({ children }: PropsWithChildren) => {
    const [saved, setSaved] = useState<boolean>(false);
    const pathname = usePathname();
    const userToken = getToken();
    const { mutate } = useSaveFCMToken();
    const domain = Cookies.get("domain") ?? DEFAULT_API_URL;
    const { token, isSafari, isIOS, requestPermission, permissionStatus } = useFCM();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (isSafari && permissionStatus === "default" && !isIOS) {
            setIsDialogOpen(true);
        }
    }, [isSafari, permissionStatus]);

    useEffect(() => {
        if (token && !pathname.startsWith('/auth/') && domain === DEFAULT_API_URL && !saved) {
            if (userToken) {
                mutate(token);
                setSaved(true);
            }
        }
    }, [token, pathname, saved])

    useEffect(() => {
        if (pathname.startsWith('/auth/')) {
            setSaved(false);
        }
    }, [pathname])

    const handleRequestPermission = async () => {
        await requestPermission();
        setIsDialogOpen(false);
    };

    return (
        <>
            {children}
            {/* Dialog for Safari Permission Prompt */}
            {!pathname.startsWith('/auth/') && isSafari && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enable Notifications</DialogTitle>
                            <DialogDescription>
                                This site would like to send you notifications. Please allow permissions to receive updates.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleRequestPermission}>Allow</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>)
}