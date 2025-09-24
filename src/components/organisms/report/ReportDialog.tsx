import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/atoms/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { Switch } from "@/components/atoms/ui/switch";
import { Label } from "@/components/atoms/ui/label";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import { Textarea } from "@/components/atoms/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/ui/radio-group";
import { Account, Status } from "@/types/status";
import { reportOptions } from "@/types/report";
import { useFileReport } from "@/hooks/mutations/report/useFileReport";
import { useFetchRules } from "@/hooks/queries/report/useFetchRules";
import { useLocale } from "@/components/molecules/providers/localeProvider";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  account?: Account;
  status?: Status;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onClose,
  account,
  status,
}) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("spam");
  const [comment, setComment] = useState("");
  const [forward, setForward] = useState(false);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [isRemoteUser, setIsRemoteUser] = useState(false);
  const fileReportMutation = useFileReport();
  const { data: rules } = useFetchRules();
  const {t} = useLocale()

  const accountId = account?.id || status?.account?.id || "";
  const username = account?.acct || status?.account?.acct || "";
  const statusId = status?.id;

  useEffect(() => {
    setIsRemoteUser(username.includes("@"));
  }, [username]);

  const handleSubmit = () => {
    fileReportMutation.mutate({
      account_id: accountId,
      status_ids: statusId ? [statusId] : undefined,
      comment,
      forward,
      category,
      rule_ids: selectedRules,
    });
    onClose();
  };

  const handleNextFromStep1 = () => {
    if (category === "violation") {
      setStep(2); // Go to rules selection for violation
    } else {
      setStep(3); // Skip to comment input for other categories
    }
  };

  const handleClose = () => {
    setStep(1);
    setCategory("spam");
    setComment("");
    setForward(false);
    setSelectedRules([]);
    setIsRemoteUser(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        aria-label="report dialog"
        className="bg-background text-foreground max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("report.reporting")} {username}
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-white" />
        </DialogHeader>
        <div className="p-4 text-foreground">
          {step === 1 && (
            <div>
              <h3 className="text-sm font-medium mb-4">
                {t("report.modal_title_category")}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                 {t("report.choose_best_match")}
              </p>
              <RadioGroup
                value={category}
                onValueChange={setCategory}
                className="divide-y divide-gray-700 gap-0"
              >
                {Object.entries(reportOptions).map(
                  ([key, { title, description }], index, arr) => (
                    <div key={key} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value={key} id={key} />
                      <Label
                        htmlFor={key}
                        className="text-sm flex flex-col items-start"
                      >
                        <h1 className="font-medium">{t(`report.category.${key}.title`)}</h1>
                        <p className="text-xs text-gray-400">{t(`report.category.${key}.desc`)}</p>
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
              <Button
                onClick={handleNextFromStep1} // Updated handler
                className="w-full mt-4 bg-orange-900 hover:bg-orange-900/90 text-white"
              >
                {t("common.confirm")}
              </Button>
            </div>
          )}
          {step === 2 && category === "violation" && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium mb-4">
               {t("report.modal_title_violation_rules")}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {t("report.select_all")}
              </p>
              {rules?.map((rule) => (
                <div key={rule.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={rule.id}
                    checked={selectedRules.includes(rule.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRules([...selectedRules, rule.id]);
                      } else {
                        setSelectedRules(
                          selectedRules.filter((id) => id !== rule.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={rule.id} className="text-sm">
                    {rule.text}
                  </Label>
                </div>
              ))}
              <Button
                onClick={() => setStep(3)}
                className="w-full mt-4 bg-orange-900 hover:bg-orange-900/90 text-white"
              >
                {t("common.confirm")}
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">
                {t("report.modal_title_additional_info")}
              </h3>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(
                  "report.placeholder.additional_comments"
                ) as string}
                className="w-full bg-gray-800 border-gray-700 text-foreground placeholder-gray-400"
              />
              {isRemoteUser && (
                <div className="space-y-2">
                  <p className="text-sm font-normal">
                    {t("report.forward.anonymized_message")}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={forward}
                      onCheckedChange={setForward}
                      className="data-[state=checked]:bg-orange-500 dark:data-[state=unchecked]:bg-gray-400/90"
                      thumbClassName="dark:data-[state=checked]:bg-white"
                    />
                    <Label className="text-sm">
                      <span className="text-xs text-gray-400 block">
                       
                        {t("report.forward.forward_to_domain", { domain: username.split("@")[1] })}
                      </span>
                    </Label>
                  </div>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                className="w-full bg-orange-900 hover:bg-orange-900/90 text-white"
              >
                {t("common.submit")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
