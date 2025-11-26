import TemplatePreview, { extractFormData } from "@/components/TemplatePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../api/httpClient";
import { API } from "../../../environment/environment";

interface FormTemplate {
  id: number;
  name: string;
  template: string;
  sequence: number;
  created_at: string;
  updated_at: string;
  is_filled: boolean;
}

function ApplicantConsentForm() {
  const [trackApplicantData, setTrackApplicantData] = useState<any>(null);
  console.log("trackApplicantData:", trackApplicantData);

  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
  const [completedTemplates, setCompletedTemplates] = useState<number[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [submittedTemplates, setSubmittedTemplates] = useState<number[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const storedData = localStorage.getItem("consentform");

      console.log("vvvvvvvv?????", storedData);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTrackApplicantData(parsedData);
        await fetchFormTemplates(parsedData);
      } else {
        console.warn("No consent form data found in localStorage");
        toast({
          title: "Warning",
          description: "No consent form data found. Please try again.",
          variant: "warn",
          duration: 4000,
        });
      }
    };
    init();
  }, []);
  useEffect(() => {
    const init = async () => {
      const storedData = localStorage.getItem("consentform");

      console.log("vvvvvvvv?????", storedData);

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        setTrackApplicantData(parsedData);

        await fetchFormTemplates(parsedData, "filledtemp");
      }
    };

    init();
  }, []);

  const fetchFormTemplates = async (applicantData: any, edittype?: any) => {
    setIsLoadingTemplates(true);
    let finaledit;
    if (edittype == "filledtemp") {
      finaledit = false;
    } else {
      finaledit = true;
    }
    console.log("finaledit :", finaledit);

    try {
      const response = await httpClient.get(
        `${API.MATSER_CONSENT_FORMS_API}?gender=${applicantData?.Applicant_PersonalDetails__gender}&dob=${applicantData?.Applicant_PersonalDetails__dob}&applicant_number=${applicantData?.applicant_number}&edit=${finaledit}`
      );

      if (response.data && Array.isArray(response.data.templates)) {
        const templates = response.data.templates;
        setFormTemplates(templates);
        console.log("Fetched Templates:", templates);

        // ✅ Find the first not filled template
        const firstNotFilledIndex = templates.findIndex(
          (t: any) => !t.is_filled
        );

        if (firstNotFilledIndex === -1) {
          // All templates are filled
          setCurrentTemplateIndex(0); // Show the first template
          setSubmittedTemplates(templates.map((_: any, idx: any) => idx)); // Enable Next button for all
        } else {
          // Start at the first not filled template
          setCurrentTemplateIndex(firstNotFilledIndex);
          setSubmittedTemplates(templates.slice(0, firstNotFilledIndex)); // previous templates are "submitted"
        }
      } else {
        toast({
          title: "Warning",
          description: "No templates available.",
          variant: "warn",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to load form templates.",
        duration: 4000,
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const populateFormData = (data: any) => {
    const container = document.getElementById("template-container");
    if (!container) return;

    // ✅ Text inputs, selects, and textareas
    const textElements = container.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(
      'input[type="text"], input[type="email"], input[type="number"], input[type="date"], input[type="tel"], textarea, select'
    );

    textElements.forEach((input) => {
      const name = input.name;
      if (name) {
        const path = name
          .replace(/\[|\]/g, ".")
          .split(".")
          .filter((key) => key !== "");
        let val = data;
        for (let key of path) {
          if (val && val[key] !== undefined) {
            val = val[key];
          } else {
            val = "";
            break;
          }
        }
        input.value = String(val ?? "");
      }
    });

    // ✅ Checkboxes
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not([type="radio"])'
    );
    checkboxes.forEach((input) => {
      const name = input.name;
      if (name) {
        const path = name
          .replace(/\[|\]/g, ".")
          .split(".")
          .filter((key) => key !== "");
        let val = data;
        for (let key of path) {
          if (val && val[key] !== undefined) {
            val = val[key];
          } else {
            val = false;
            break;
          }
        }
        input.checked = Boolean(val);
      }
    });

    // ✅ Radio buttons
    const radios = container.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]'
    );
    radios.forEach((input) => {
      const name = input.name;
      if (name) {
        const path = name
          .replace(/\[|\]/g, ".")
          .split(".")
          .filter((key) => key !== "");
        let groupVal = data;
        for (let key of path) {
          if (groupVal && groupVal[key] !== undefined) {
            groupVal = groupVal[key];
          } else {
            groupVal = "";
            break;
          }
        }
        input.checked = String(input.value) === String(groupVal);
      }
    });
  };

  // useEffect(() => {
  //   if (formTemplates.length > 0 && currentTemplateIndex >= 0) {
  //     const templateId = formTemplates[currentTemplateIndex].id;
  //     const stored = localStorage.getItem(`filled_template_${templateId}`);
  //     if (stored) {
  //       const data = JSON.parse(stored);
  //       // Small delay to ensure DOM is rendered
  //       setTimeout(() => {
  //         populateFormData(data);
  //       }, 100);
  //     }
  //   }
  // }, [currentTemplateIndex, formTemplates]);

  const ProgressIndicator = () => {
    if (formTemplates.length === 0) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="flex flex-col space-y-1 relative flex-1">
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200">
            <div
              className="w-0.5 bg-green-500 transition-all duration-300"
              style={{
                height: `${
                  (currentTemplateIndex / (formTemplates.length - 1)) * 100
                }%`,
              }}
            />
          </div>
          {formTemplates.map((template, index) => {
            const isCompleted = completedTemplates.includes(index);
            const isCurrent = currentTemplateIndex === index;
            const isUpcoming = index > currentTemplateIndex;

            return (
              <div
                key={template.id}
                className="flex items-start space-x-3 relative z-10 py-3"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 border-blue-500 text-white shadow-lg"
                      : isUpcoming
                      ? "bg-white border-gray-300 text-gray-500"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p
                    className={`text-sm leading-tight break-words ${
                      isCurrent
                        ? "text-blue-600 font-semibold"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {template.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

const isCanvasBlank = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;

  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );

  return !pixelBuffer.some(color => color !== 0);
};


  const getCanvasBlob = (canvasId: string): Promise<Blob | any> => {
    return new Promise((resolve) => {
      const canvas = document.getElementById(
        canvasId
      ) as HTMLCanvasElement | null;
      if (!canvas) return resolve(null);
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const findMissingFields = (data: any) => {
    let missing: any = [];
    Object.entries(data).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === false
      ) {
        missing.push(key);
      }
    });
    return missing;
  };

  const safeAppendSignature = (
    formData: FormData,
    fieldName: string,
    blob: Blob | null,
    fileName: string
  ) => {
    if (blob instanceof Blob) {
      formData.append(fieldName, blob, fileName);
    }
  };

  const handleSubmitTemplate = async () => {
    if (!formTemplates[currentTemplateIndex]) return;

    const templateId = formTemplates[currentTemplateIndex].id;
    const templateData = extractFormData("template-container");
    console.log("templateData :", templateData);

    // ✅ Section-wise validation (only for Template ID = 2)
    if (templateId === 2) {
      const errors: string[] = [];

      const sectionCheck = (questions: string[], sectionName: string) => {
        let missingAnswer = questions.some((q) => !templateData[q]);
        let missingDetails = questions.some(
          (q) =>
            templateData[q] === "Yes" &&
            (!templateData[`${q}_details`] ||
              templateData[`${q}_details`].trim() === "")
        );
        if (missingAnswer || missingDetails)
          errors.push(`${sectionName} section is incomplete`);
      };

      sectionCheck(["q1", "q2", "q3"], "General Health History");
      sectionCheck(["q4", "q5", "q6"], "Infectious Disease History");
      sectionCheck(["q7", "q8"], "Family Medical History");
      if ("q9" in templateData)
        sectionCheck(["q9", "q10"], "Pregnancy History");
      sectionCheck(["q11", "q12"], "Mental Health");
      if ("q13" in templateData)
        sectionCheck(["q13", "q14", "q15", "q16"], "Lifestyle & Habits");
      sectionCheck(["q17", "q18"], "Travel History");

      if (templateData.declaration === false)
        errors.push("Check the Declaration");

      if (errors.length > 0) {
        toast({
          title: "Form Incomplete",
          description: errors.join("\n"),
          duration: 5000,
        });
        return;
      }
    } else {
      const missing = findMissingFields(templateData);
      if (missing.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please fill: ${missing.join(", ")}`,
          duration: 5000,
        });
        return;
      }
    }

    const canvas = document.getElementById(
      "applicantSignature"
    ) as HTMLCanvasElement;

    if (!canvas || isCanvasBlank(canvas)) {
      toast({
        title: "Missing Signature",
        description: "Applicant Signature is required to continue.",
        duration: 4000,
      });
      return;
    }

    const applicantSignatureBlob = await getCanvasBlob("applicantSignature");
    console.log("applicantSignatureBlob:", applicantSignatureBlob);
    // return;
    const physicianSignatureBlob = await getCanvasBlob("physicianSignature");
    const guardianSignatureBlob = await getCanvasBlob("guardianSignature");
    const counsellorSignatureBlob = await getCanvasBlob("counsellorSignature");

    // ✅ Store filled data locally
    // localStorage.setItem(
    //   `filled_template_${formTemplates[currentTemplateIndex].id}`,
    //   JSON.stringify(templateData)
    // );

    const formData = new FormData();
    formData.append("formtype", String(templateId));
    formData.append("template", JSON.stringify(templateData));
    formData.append(
      "applicant",
      String(trackApplicantData.Applicant_PersonalDetails__id)
    );
    formData.append("is_active", "true");

    safeAppendSignature(
      formData,
      "ApplicantSignature",
      applicantSignatureBlob,
      "applicant_signature.png"
    );
    safeAppendSignature(
      formData,
      "GuardianSignature",
      guardianSignatureBlob,
      "guardian_signature.png"
    );
    safeAppendSignature(
      formData,
      "CounsellorSignature",
      counsellorSignatureBlob,
      "counsellor_signature.png"
    );
    safeAppendSignature(
      formData,
      "PhysicianSignature",
      physicianSignatureBlob,
      "physician_signature.png"
    );

    try {
      const response = await httpClient.post(
        API.APPLICANT_CONSENTFORM_API,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Template saved:", response.data);
      const storedData = localStorage.getItem("consentform");

      console.log("vvvvvvvv?????", storedData);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTrackApplicantData(parsedData);
        await fetchFormTemplates(parsedData, "filledtemp");
      }
      toast({
        title: "Success",
        description: "Form Saved Successfully",
        duration: 3000,
      });

      // ✅ Mark this form as submitted (ENABLE NEXT BUTTON)
      setSubmittedTemplates((prev) => [...prev, currentTemplateIndex]);

      // if (currentTemplateIndex < formTemplates.length - 1) {
      //   setTimeout(() => {
      //     handleNextTemplate();
      //   }, 300); // small delay feels natural
      // }

      if (currentTemplateIndex === formTemplates.length - 1) {
        setTimeout(() => {
          navigatetohome();
        }, 400); // small delay for toast to show
        return;
      }
    } catch (error) {
      console.error("❌ Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to submit template",
        duration: 4000,
      });
    }
  };

  const handleUploadPDF = async () => {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("applicant_number", trackApplicantData?.applicant_number);

    try {
      const response = await httpClient.post(
        API.APPLICANT_UPLOAD_PDF,
        formData
      );

      if (response.data?.status === "SUCCESS") {
        toast({
          title: "Success",
          description: response.data.message || "PDF uploaded successfully",
          variant: "success",
          duration: 4000,
        });
        setFile(null);
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to upload PDF",
          // variant: "destructive",
          duration: 4000,
        });
        setFile(null);
      }
    } catch (error: any) {
      console.error("PDF upload error:", error);

      // Robust error message handling
      let errMsg = "Failed to upload PDF";

      if (error.response) {
        // Backend returned a response (4xx or 5xx)
        if (error.response.data && error.response.data.message) {
          errMsg = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          errMsg = error.response.data;
        } else {
          errMsg = `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request made but no response
        errMsg = "No response from server";
      } else if (error.message) {
        // Some other JS error
        errMsg = error.message;
      }

      toast({
        title: "Error",
        description: errMsg,
        // variant: "destructive",
        duration: 4000,
      });
    }
  };

  // useEffect(() => {
  //   const currentTemplate = formTemplates[currentTemplateIndex];
  //   if (!currentTemplate) return;

  //   const savedData = localStorage.getItem(
  //     `filled_template_${currentTemplate.id}`
  //   );

  //   if (savedData) {
  //     const parsed = JSON.parse(savedData);
  //     console.log(
  //       `🔄 Prefilling Template ${currentTemplate.id} with saved data:`,
  //       parsed
  //     );

  //     // Wait for DOM to render before prefilling
  //     setTimeout(() => {
  //       prefillForm("template-container", parsed);
  //     }, 300);
  //   } else {
  //     console.log(`ℹ️ No saved data for template ${currentTemplate.id}`);
  //   }
  // }, [currentTemplateIndex, formTemplates]);

  const handlePrevTemplate = () => {
    if (currentTemplateIndex > 0) setCurrentTemplateIndex((prev) => prev - 1);
  };

  const handleNextTemplate = () => {
    if (currentTemplateIndex < formTemplates.length - 1) {
      setCompletedTemplates((prev) => [...prev, currentTemplateIndex]);
      setCurrentTemplateIndex((prev) => prev + 1);
    }
  };

  const handleCompleteAllTemplates = () => {
    setCompletedTemplates((prev) => [...prev, currentTemplateIndex]);
    toast({
      title: "Success!",
      description: "All forms have been completed successfully!",
      variant: "success",
      duration: 4000,
    });

    setTimeout(() => {
      setCurrentTemplateIndex(0);
      setCompletedTemplates([]);
    }, 1000);
  };

  const renderCurrentTemplate = () => {
    if (formTemplates.length === 0 || !formTemplates[currentTemplateIndex]) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No template available</p>
        </div>
      );
    }
    const currentTemplate = formTemplates[currentTemplateIndex];
    return (
      <>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            color: "red",
            fontWeight: "bold",
            marginLeft: "30px",
          }}
        >
          Note : All Fields are Mandatory
        </span>
        <div id="template-container">
          <TemplatePreview htmlContent={currentTemplate.template} />
        </div>
      </>
    );
  };

  const navigatetohome = () => {
    // Loop through keys and remove only those starting with 'filled_template_'
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("filled_template_")) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem("consentform");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              width: "100%",
              padding: "10px",
            }}
          >
            <h3
              style={{ width: "80%" }}
              className="text-2xl font-bold text-gray-800  mr-10 text-center"
            >
              Applicant Form
            </h3>
            <button
              style={{
                background:
                  "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
              onClick={navigatetohome}
            >
              Back
            </button>
          </div>
          {isLoadingTemplates ? (
            <p>Loading templates...</p>
          ) : formTemplates.length > 0 ? (
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 text-center justify-center"
              style={{ fontSize: "16px" }}
            >
              <span className="flex gap-2">
                Applicant's Name:{" "}
                <strong className="text-gray-900">
                  {trackApplicantData?.Applicant_PersonalDetails__fullname}
                </strong>
              </span>
              <span className="flex gap-2">
                HAP-ID Number:{" "}
                <strong className="text-gray-900">
                  {trackApplicantData?.hap_id}
                </strong>
              </span>
              <span className="flex gap-2">
                Passport Number:{" "}
                <strong className="text-gray-900">
                  {trackApplicantData?.passport_number}
                </strong>
              </span>
              <span className="flex gap-2">
                Contact Number:{" "}
                <strong className="text-gray-900">
                  {trackApplicantData?.contact_number}
                </strong>
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content */}
      {isLoadingTemplates ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading templates...</p>
        </div>
      ) : formTemplates.length > 0 ? (
        <div className="flex h-[calc(100vh-140px)]">
          <div className="w-64 bg-white border-r shadow-sm overflow-y-auto flex-shrink-0">
            <div className="p-4 flex flex-col gap-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-2">
                Form Progress
              </h5>

              {/* File Upload Section */}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer border rounded px-2 py-1 text-sm"
                />
                <Button
                  onClick={handleUploadPDF}
                  className="flex items-center justify-center text-white hover:brightness-90"
                  style={{
                    background:
                      "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                  }}
                >
                  Referral / Appointment Letter
                </Button>
              </div>

              {/* Progress Indicator */}
              <ProgressIndicator />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-white">
              <div
                className="max-w-5xl mx-auto p-6"
                style={{ maxWidth: "90rem" }}
              >
                {renderCurrentTemplate()}
              </div>
            </div>

            <div className="bg-white border-t shadow-lg px-6 py-4">
              {/* <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
                <Button
                  onClick={handlePrevTemplate}
                  disabled={currentTemplateIndex === 0}
                  style={{
                    background:
                      "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                    color: "white",
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Template {currentTemplateIndex + 1} of{" "}
                    {formTemplates.length}
                  </span>

                  <Button
                    onClick={handleSubmitTemplate}
                    style={{
                      background:
                        "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                      color: "white",
                    }}
                  >
                    Submit
                  </Button>
                </div>

                {currentTemplateIndex < formTemplates.length - 1 ? (
                  <Button
                    onClick={handleNextTemplate}
                    disabled={
                      !formTemplates[currentTemplateIndex]?.is_filled &&
                      !submittedTemplates.includes(currentTemplateIndex)
                    }
                    style={{
                      background:
                        "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                      color: "white",
                    }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      Object.keys(localStorage).forEach((key) => {
                        if (key.startsWith("filled_template_"))
                          localStorage.removeItem(key);
                      });
                      localStorage.removeItem("consentform");
                      navigate("/");
                    }}
                    disabled={
                      !formTemplates[currentTemplateIndex]?.is_filled &&
                      !submittedTemplates.includes(currentTemplateIndex)
                    }
                    className="flex items-center bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete All Templates
                  </Button>
                )}
              </div> */}
              <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
                {/* Previous Button */}
                <Button
                  onClick={handlePrevTemplate}
                  disabled={currentTemplateIndex === 0}
                  style={{
                    background:
                      "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                    color: "white",
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {/* Template Count */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Template {currentTemplateIndex + 1} of{" "}
                    {formTemplates.length}
                  </span>
                </div>

                {(() => {
                  const isLast =
                    currentTemplateIndex === formTemplates.length - 1;
                  const isFilled =
                    formTemplates[currentTemplateIndex]?.is_filled;
                  const alreadySubmitted =
                    submittedTemplates.includes(currentTemplateIndex);

                  // 🔥 NEW RULE: Check if all templates are filled
                  const allFilled = formTemplates.every(
                    (t) => t.is_filled === true
                  );

                  // ========================================================
                  // 1️⃣ ALL TEMPLATES FILLED → VIEW MODE (Prev + Next only)
                  // ========================================================
                  if (allFilled) {
                    // Last template → Show Close
                    if (isLast) {
                      return (
                        <Button
                          onClick={() => navigate("/")}
                          style={{
                            background:
                              "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                            color: "white",
                          }}
                        >
                          Close
                        </Button>
                      );
                    }

                    // Not last → Next only
                    return (
                      <Button
                        onClick={handleNextTemplate}
                        style={{
                          background:
                            "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                          color: "white",
                        }}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    );
                  }

                  // ========================================================
                  // 2️⃣ NORMAL MODE → Submit / Next / Final Submit Logic
                  // ========================================================

                  // Last template NOT filled → Final Submit
                  if (isLast && !isFilled && !alreadySubmitted) {
                    return (
                      <Button
                        onClick={handleSubmitTemplate}
                        style={{
                          background:
                            "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                          color: "white",
                        }}
                      >
                        Final Submit
                      </Button>
                    );
                  }

                  // Last template already filled → Close
                  if (isLast && (isFilled || alreadySubmitted)) {
                    return (
                      <Button
                        onClick={() => navigate("/")}
                        style={{
                          background:
                            "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                          color: "white",
                        }}
                      >
                        Close
                      </Button>
                    );
                  }

                  // Not filled & not last → Submit & Next
                  if (!isFilled && !alreadySubmitted) {
                    return (
                      <Button
                        onClick={handleSubmitTemplate}
                        style={{
                          background:
                            "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                          color: "white",
                        }}
                      >
                        Submit & Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    );
                  }

                  // Already filled → Next
                  return (
                    <Button
                      onClick={handleNextTemplate}
                      style={{
                        background:
                          "linear-gradient(145deg, hsl(30, 95%, 58%) 0%, hsl(25, 100%, 65%) 100%)",
                        color: "white",
                      }}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>No templates found.</p>
        </div>
      )}
    </div>
  );
}

export default ApplicantConsentForm;
