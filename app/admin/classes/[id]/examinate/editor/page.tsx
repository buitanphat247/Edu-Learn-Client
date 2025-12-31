"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useRouter, useParams } from "next/navigation";
import { App, Button, Input, Select, InputNumber, Radio, Space, Tag, Divider, Modal } from "antd";
import CustomCard from "@/app/components/common/CustomCard";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
  CodeOutlined,
  SettingOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import katex from "katex";
import "katex/dist/katex.min.css";

// New data structure interfaces
interface Answer {
  key: string;
  content: string;
}

interface QuestionItem {
  id: string;
  question: string;
  answers: Answer[];
  correct_answer: Record<string, boolean>; // e.g., { A: true, B: false, C: false, D: false }
}

interface PartData {
  name: string;
  questions: QuestionItem[];
}

// Legacy interface for backward compatibility (will be removed)
interface Question {
  id: string;
  part: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  points: number;
  question: string;
  options: { label: string; text: string; isCorrect: boolean; trueFalse?: "true" | "false" | null }[];
  answer?: string;
}

interface OptionCardProps {
  answer: Answer;
  answerIndex: number;
  questionId: string;
  partIndex: number;
  canDelete: boolean;
  questionType: "multiple_choice" | "true_false" | "fill_blank";
  isCorrect: boolean;
  correctAnswer?: Record<string, boolean>; // For true_false type
  onUpdate: (partIndex: number, questionId: string, answerIndex: number, field: string, value: any) => void;
  onRemove: (partIndex: number, questionId: string, answerIndex: number) => void;
  onSelect: (partIndex: number, questionId: string, answerIndex: number) => void;
}

interface QuestionCardProps {
  question: QuestionItem;
  partIndex: number;
  partName: string;
  questionIndex: number;
  onUpdate: (partIndex: number, questionId: string, field: keyof QuestionItem, value: any) => void;
  onDelete: (partIndex: number, questionId: string) => void;
  onAddAnswer: (partIndex: number, questionId: string) => void;
  onUpdateAnswer: (partIndex: number, questionId: string, answerIndex: number, field: string, value: any) => void;
  onRemoveAnswer: (partIndex: number, questionId: string, answerIndex: number) => void;
  onSelectAnswer: (partIndex: number, questionId: string, answerIndex: number) => void;
}

interface GeneralConfigProps {
  timeMinutes: number;
  maxScore: number;
  totalQuestions: number;
  status: string;
  onTimeChange: (value: number | null) => void;
  onMaxScoreChange: (value: number | null) => void;
  onTotalQuestionsChange: (value: number | null) => void;
  onStatusChange: (value: string) => void;
}

interface LatexEditorProps {
  latexSource: string;
  latexLines: string[];
  totalLines: number;
  onLatexChange: (value: string) => void;
  lineNumbersRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onLineNumbersScroll: () => void;
  onTextareaScroll: () => void;
}

// Memoized Option Card Component
const OptionCard = memo<OptionCardProps>(
  ({ answer, answerIndex, questionId, partIndex, canDelete, questionType, isCorrect, correctAnswer, onUpdate, onRemove, onSelect }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (
          questionType === "multiple_choice" &&
          !(e.target as HTMLElement).closest(".delete-option-btn") &&
          !(e.target as HTMLElement).closest(".true-false-radio")
        ) {
          if (!isCorrect) {
            onSelect(partIndex, questionId, answerIndex);
          }
        }
      },
      [isCorrect, partIndex, questionId, answerIndex, questionType, onSelect]
    );

    const handleContentChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate(partIndex, questionId, answerIndex, "content", e.target.value);
      },
      [partIndex, questionId, answerIndex, onUpdate]
    );

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(partIndex, questionId, answerIndex);
      },
      [partIndex, questionId, answerIndex, onRemove]
    );

    const handleTrueFalseChange = useCallback(
      (e: any) => {
        // For true_false type, toggle the correct_answer
        onSelect(partIndex, questionId, answerIndex);
      },
      [partIndex, questionId, answerIndex, onSelect]
    );

    // Get true/false value from correct_answer
    const trueFalseValue = useMemo(() => {
      if (questionType === "true_false" && correctAnswer) {
        const isTrue = correctAnswer[answer.key] === true;
        return isTrue ? "true" : "false";
      }
      return null;
    }, [questionType, correctAnswer, answer.key]);

    return (
      <div
        className={`group relative flex items-center gap-1.5 px-1.5 py-1 rounded border transition-all ${
          questionType === "multiple_choice" ? "cursor-pointer" : ""
        } ${questionType === "multiple_choice" && isCorrect ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
        onClick={handleClick}
      >
        <div
          className={`w-6 h-6 rounded flex items-center justify-center font-semibold text-xs text-gray-700 shrink-0 ${
            questionType === "multiple_choice" && isCorrect ? "bg-blue-500 text-white" : "bg-gray-100"
          } transition-colors`}
        >
          {answer.key}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          {answer.content && hasMathPlaceholder(answer.content) ? (
            <div className="text-sm leading-relaxed text-gray-700 py-1">
              <ParsedMathContent text={answer.content} />
            </div>
          ) : (
            <Input.TextArea
              value={answer.content}
              onChange={handleContentChange}
              placeholder="Nhập nội dung đáp án..."
              bordered={false}
              autoSize={{ minRows: 1, maxRows: 5 }}
              className="shadow-none px-0 bg-transparent hover:bg-transparent focus:bg-transparent resize-none! text-sm leading-5 py-0"
              style={{ padding: 0, height: "auto", minHeight: "auto", maxHeight: "none" }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        {questionType === "true_false" && (
          <div className="true-false-radio shrink-0" onClick={(e) => e.stopPropagation()}>
            <Radio.Group value={trueFalseValue} onChange={handleTrueFalseChange}>
              <Radio value="true">Đúng</Radio>
              <Radio value="false">Sai</Radio>
            </Radio.Group>
          </div>
        )}
        {canDelete && (
          <div className="absolute top-1/2 -translate-y-1/2 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              className="delete-option-btn w-6 h-6 p-0 flex items-center justify-center"
            />
          </div>
        )}
      </div>
    );
  }
);

OptionCard.displayName = "OptionCard";

// Helper function to determine question type from part name
const getQuestionType = (partName: string): "multiple_choice" | "true_false" | "fill_blank" => {
  if (partName.includes("đúng sai") || partName.includes("Đúng/Sai")) {
    return "true_false";
  }
  if (partName.includes("trả lời ngắn") || partName.includes("Tự luận")) {
    return "fill_blank";
  }
  return "multiple_choice";
};

// Memoized Question Card Component
const QuestionCard = memo<QuestionCardProps>(
  ({ question, partIndex, partName, questionIndex, onUpdate, onDelete, onAddAnswer, onUpdateAnswer, onRemoveAnswer, onSelectAnswer }) => {
    const handleQuestionChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate(partIndex, question.id, "question", e.target.value);
      },
      [partIndex, question.id, onUpdate]
    );

    const handleDelete = useCallback(() => {
      onDelete(partIndex, question.id);
    }, [partIndex, question.id, onDelete]);

    const handleAddAnswer = useCallback(() => {
      onAddAnswer(partIndex, question.id);
    }, [partIndex, question.id, onAddAnswer]);

    const handleSelectAnswer = useCallback(
      (answerIndex: number) => {
        onSelectAnswer(partIndex, question.id, answerIndex);
      },
      [partIndex, question.id, onSelectAnswer]
    );

    // Determine question type from part name
    const questionType = useMemo(() => {
      return getQuestionType(partName);
    }, [partName]);

    const getTypeLabel = useCallback(() => {
      switch (questionType) {
        case "multiple_choice":
          return "Trắc nghiệm";
        case "true_false":
          return "Đúng/Sai";
        case "fill_blank":
          return "Tự luận";
        default:
          return "Trắc nghiệm";
      }
    }, [questionType]);

    const getTypeColor = useCallback(() => {
      switch (questionType) {
        case "multiple_choice":
          return "blue";
        case "true_false":
          return "orange";
        case "fill_blank":
          return "green";
        default:
          return "blue";
      }
    }, [questionType]);

    // Get current correct answer key for multiple choice
    const currentCorrectAnswer = useMemo(() => {
      if (questionType === "multiple_choice") {
        const correctKey = Object.keys(question.correct_answer).find(
          (key) => question.correct_answer[key] === true
        );
        return correctKey || undefined;
      }
      return undefined;
    }, [questionType, question.correct_answer]);

    // Handle correct answer selection from dropdown
    const handleCorrectAnswerChange = useCallback(
      (value: string) => {
        // Find answer index by key
        const answerIndex = question.answers.findIndex((ans) => ans.key === value);
        if (answerIndex !== -1) {
          onSelectAnswer(partIndex, question.id, answerIndex);
        }
      },
      [partIndex, question.id, question.answers, onSelectAnswer]
    );

    // Generate options for Select dropdown
    const answerOptions = useMemo(() => {
      return question.answers.map((answer) => {
        // Extract text before first placeholder or use first 30 chars
        let displayContent = answer.content;
        
        // If content has placeholder, get text before it
        const placeholderIndex = displayContent.indexOf("[:$");
        if (placeholderIndex > 0) {
          displayContent = displayContent.substring(0, placeholderIndex).trim();
        }
        
        // Remove any trailing punctuation and limit length
        displayContent = displayContent.replace(/[.,;:!?]+$/, "").trim();
        if (displayContent.length > 25) {
          displayContent = displayContent.substring(0, 25) + "...";
        }
        
        // If no meaningful content, just show the key
        if (!displayContent || displayContent.length < 3) {
          return {
            value: answer.key,
            label: answer.key,
          };
        }
        
        return {
          value: answer.key,
          label: `${answer.key}. ${displayContent}`,
        };
      });
    }, [question.answers]);

    // Render answers based on question type
    const renderAnswers = () => {
      if (questionType === "true_false") {
        // True/False: Multiple answers with Đúng/Sai radio buttons
        return (
          <>
            <div className="space-y-2">
              {question.answers.map((answer, answerIndex) => {
                const isCorrect = question.correct_answer[answer.key] === true;
                return (
                  <OptionCard
                    key={answerIndex}
                    answer={answer}
                    answerIndex={answerIndex}
                    questionId={question.id}
                    partIndex={partIndex}
                    canDelete={question.answers.length > 2}
                    questionType={questionType}
                    isCorrect={isCorrect}
                    correctAnswer={question.correct_answer}
                    onUpdate={onUpdateAnswer}
                    onRemove={onRemoveAnswer}
                    onSelect={onSelectAnswer}
                  />
                );
              })}
            </div>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddAnswer} className="w-full mt-3">
              + Thêm câu hỏi
            </Button>
          </>
        );
      } else if (questionType === "fill_blank") {
        // Fill blank: Single input for answer
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án đúng:</label>
            {question.answers[0]?.content && hasMathPlaceholder(question.answers[0].content) ? (
              <div className="text-sm leading-relaxed text-gray-700 py-2">
                <ParsedMathContent text={question.answers[0].content} />
              </div>
            ) : (
              <Input
                value={question.answers[0]?.content || ""}
                onChange={(e) => onUpdateAnswer(partIndex, question.id, 0, "content", e.target.value)}
                placeholder="Nhập đáp án..."
                className="w-full"
              />
            )}
          </div>
        );
      } else {
        // Multiple choice: Default behavior
        return (
          <>
            <div className="grid grid-cols-1 gap-2">
              {question.answers.map((answer, answerIndex) => {
                const isCorrect = question.correct_answer[answer.key] === true;
                return (
                  <OptionCard
                    key={answerIndex}
                    answer={answer}
                    answerIndex={answerIndex}
                    questionId={question.id}
                    partIndex={partIndex}
                    canDelete={question.answers.length > 2}
                    questionType={questionType}
                    isCorrect={isCorrect}
                    correctAnswer={question.correct_answer}
                    onUpdate={onUpdateAnswer}
                    onRemove={onRemoveAnswer}
                    onSelect={onSelectAnswer}
                  />
                );
              })}
            </div>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddAnswer} className="w-full mt-3">
              + Thêm đáp án
            </Button>
          </>
        );
      }
    };

    return (
      <CustomCard key={question.id} padding="md" className="border-l-4 border-l-blue-500">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag color="blue" className="px-3 py-1 text-sm font-semibold">
                Câu {questionIndex + 1}
              </Tag>
              <Tag color={getTypeColor()} className="px-3 py-1 text-sm">
                {getTypeLabel()}
              </Tag>
            </div>
            <div className="flex items-center gap-2">
              {questionType === "multiple_choice" && (
                <Select
                  value={currentCorrectAnswer}
                  onChange={handleCorrectAnswerChange}
                  placeholder="Chọn đáp án đúng"
                  size="small"
                  style={{ width: 180 }}
                  options={answerOptions}
                />
              )}
              <Button type="text" icon={<FileTextOutlined />} size="small" />
              <Button type="text" icon={<InfoCircleOutlined />} size="small" />
              <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={handleDelete} />
            </div>
          </div>
          <div>
            {question.question && hasMathPlaceholder(question.question) ? (
              <div className="text-base leading-relaxed text-gray-700 py-2">
                <ParsedMathContent text={question.question} />
              </div>
            ) : (
              <Input.TextArea value={question.question} onChange={handleQuestionChange} placeholder="Nhập câu hỏi..." rows={3} className="text-base" />
            )}
          </div>
          <div>{renderAnswers()}</div>
        </div>
      </CustomCard>
    );
  }
);

QuestionCard.displayName = "QuestionCard";

// Memoized General Config Component
const GeneralConfig = memo<GeneralConfigProps>(
  ({ timeMinutes, maxScore, totalQuestions, status, onTimeChange, onMaxScoreChange, onTotalQuestionsChange, onStatusChange }) => {
    const statusOptions = useMemo(
      () => [
        { value: "draft", label: "Bản nháp" },
        { value: "published", label: "Xuất bản" },
      ],
      []
    );

    return (
      <CustomCard
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-gray-600" />
            <span className="font-semibold">Cấu hình chung</span>
          </div>
        }
        padding="md"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
            <InputNumber value={timeMinutes} onChange={onTimeChange} min={1} className="w-full" size="middle" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm tối đa</label>
            <InputNumber value={maxScore} onChange={onMaxScoreChange} min={0} step={0.5} className="w-full" size="middle" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng câu hỏi</label>
            <InputNumber value={totalQuestions} onChange={onTotalQuestionsChange} min={1} className="w-full" size="middle" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <Select value={status} onChange={onStatusChange} className="w-full" size="middle" options={statusOptions} />
          </div>
        </div>
      </CustomCard>
    );
  }
);

GeneralConfig.displayName = "GeneralConfig";

// Memoized LaTeX Editor Component
const LatexEditor = memo<LatexEditorProps>(
  ({ latexSource, latexLines, totalLines, onLatexChange, lineNumbersRef, textareaRef, onLineNumbersScroll, onTextareaScroll }) => {
    const handleLatexChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onLatexChange(e.target.value);
      },
      [onLatexChange]
    );

    return (
      <div className="h-full overflow-y-auto flex flex-col">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              <CodeOutlined className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-800">&lt;&gt; LATEX SOURCE</span>
            </div>
            <div className="flex items-center gap-2">
              <Button type="text" size="small" icon={<SaveOutlined />} />
              <Button type="text" size="small" icon={<SettingOutlined />} />
              <Button type="text" size="small" icon={<FullscreenOutlined />} />
            </div>
          </div>
          <div className="relative bg-white text-gray-800 font-mono text-xs flex-1 overflow-hidden flex border-t border-gray-200">
            <div
              ref={lineNumbersRef}
              onScroll={onLineNumbersScroll}
              className="bg-gray-50 text-gray-600 px-3 py-2 text-right select-none border-r border-gray-200 shrink-0 overflow-y-auto custom-scrollbar"
              style={{ maxHeight: "100%" }}
            >
              {latexLines.map((_, index) => (
                <div key={index} className="leading-6">
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-white relative">
              <textarea
                ref={textareaRef}
                onScroll={onTextareaScroll}
                value={latexSource}
                onChange={handleLatexChange}
                className="absolute inset-0 w-full h-full p-2 m-0 font-mono text-xs text-gray-800 bg-white border-none outline-none resize-none leading-6 custom-scrollbar overflow-y-auto"
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 shrink-0">
            <div className="flex items-center gap-4">
              <span>Line {totalLines}, Column 1</span>
              <span>UTF-8</span>
              <span>LaTeX</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LatexEditor.displayName = "LatexEditor";

// MATH_DATA constant for math formula rendering
const MATH_DATA: Record<string, string> = {
  mathm10_1: "\\text{ABC}",
  mathm10_2: "BC^2 = AB^2 + AC^2 + 2AB \\cdot AC \\cdot \\cos A",
  mathm10_3: "BC^2 = AB^2 + AC^2 - 2AB \\cdot AC \\cdot \\cos A",
  mathm10_4: "BC^2 = AB^2 + AC^2 + 2AB \\cdot AC \\sin A",
  mathm10_5: "BC^2 = AB^2 + AC^2 - 2 \\cdot AB \\cdot AC \\cdot \\sin A",
  mathm11_1: "<b>AB</b>",
  mathm11_2: "M, N",
  mathm11_3: "<b>AB</b>",
  mathm11_4: "2MA = 3MB",
  mathm11_5: "2\\overrightarrow{MA} = 3\\overrightarrow{MB}",
  mathm11_6: "2\\overrightarrow{MA} = -3\\overrightarrow{MB}",
  mathm11_7: "2\\overrightarrow{AB} = 3\\overrightarrow{AM}",
  mathm11_8: "\\overrightarrow{3BM} = \\overrightarrow{BA}",
  mathm12_1: "\\begin{cases}\nx - y \\geq 0 \\\\\nx - y \\leq 2 \\\\\nx + y \\geq 0 \\\\\nx + y \\leq 4\n\\end{cases}",
  mathm12_2: "\\text{OABC}",
  mathm12_3: "L = 2x + y",
  mathm14_1: "<b>ABCD</b>",
  mathm14_10: "\\overrightarrow{DA} + \\overrightarrow{DB} + \\overrightarrow{DC} = 2 \\overrightarrow{DG}",
  mathm14_11: "\\overrightarrow{DO} = 2 \\overrightarrow{DG}",
  mathm14_2: "M, N",
  mathm14_3: "AB, CD",
  mathm14_4: "<b>O</b>",
  mathm14_5: "<b>MN</b>",
  mathm14_6: "\\text{G}",
  mathm14_7: "\\text{ABC}",
  mathm14_8: "\\overrightarrow{DA} + \\overrightarrow{DB} = 2 \\overrightarrow{DM}",
  mathm14_9: "\\overrightarrow{DA} + \\overrightarrow{DB} + \\overrightarrow{DC} = 2 \\overrightarrow{DO}",
  mathm15_1: "<b>ABCD</b>",
  mathm15_10: "\\overrightarrow{OA} + \\overrightarrow{OB} + \\overrightarrow{OC} + \\overrightarrow{OD} = \\overrightarrow{AD} + \\overrightarrow{CB}",
  mathm15_2: "<b>O</b>",
  mathm15_3: "\\text{AC}",
  mathm15_4: "<b>BD</b>",
  mathm15_5: "\\overrightarrow{OA}",
  mathm15_6: "\\overrightarrow{oc}",
  mathm15_7: "\\overrightarrow{OB}",
  mathm15_8: "\\overrightarrow{D0}",
  mathm15_9: "\\overrightarrow{OA} + \\overrightarrow{OC} = \\overrightarrow{OB} + \\overrightarrow{OD}",
  mathm17_1: "<b>ABCD</b>",
  mathm17_2: "AB = 4, AD = 6",
  mathm17_3: "\\vec{u} = \\overline{AB} + \\overline{AC}",
  mathm18_1: "\\text{A}",
  mathm18_2: "<b>B</b>",
  mathm18_3: "\\text{AC}",
  mathm18_4: "\\overline{BAC}, \\overline{BCA}",
  mathm18_5: "AC = 21   \\text{m}, \\overline{BAC} = 58^\\circ",
  mathm18_6: "\\overline{BCA} = 80^\\circ",
  mathm18_7: "\\text{A}",
  mathm18_8: "<b>B</b>",
  mathm19_1: "\\text{A}",
  mathm19_2: "60°",
  mathm21_1: "<b>A</b>",
  mathm21_10: "2   \\text{kg}",
  mathm21_11: "<b>A</b>",
  mathm21_12: "<b>B</b>",
  mathm21_2: "0,2   \\text{kg}",
  mathm21_3: "0,1   \\text{kg}",
  mathm21_4: "<b>B</b>",
  mathm21_5: "0,2   \\text{kg}",
  mathm21_6: "0,3   \\text{kg}",
  mathm21_7: "<b>A</b>",
  mathm21_8: "<b>B</b>",
  mathm21_9: "2   \\text{kg}",
  mathm2_1: "\\text{A}",
  mathm2_10: "\\text{B}",
  mathm2_11: "\\text{A}",
  mathm2_2: "\\text{B}",
  mathm2_3: "A \\cap B",
  mathm2_4: "\\text{A}",
  mathm2_5: "\\text{B}",
  mathm2_6: "\\text{A}",
  mathm2_7: "\\text{B}",
  mathm2_8: "\\text{A}",
  mathm2_9: "\\text{B}",
  mathm4_1: "\\text{A}",
  mathm4_10: "\\text{A}",
  mathm4_11: "\\text{B}",
  mathm4_12: "\\text{A}",
  mathm4_13: "\\text{B}",
  mathm4_2: "\\text{B}",
  mathm4_3: "\\varnothing",
  mathm4_4: "\\text{A}",
  mathm4_5: "\\text{B}",
  mathm4_6: "\\text{A}",
  mathm4_7: "\\text{B}",
  mathm4_8: "\\text{B}",
  mathm4_9: "\\text{A}",
  mathm5_1: "\\overrightarrow{a},\\overrightarrow{b}",
  mathm5_10: "\\overrightarrow{a},\\overrightarrow{b}",
  mathm5_11: "\\text{k}",
  mathm5_12: "k(\\overrightarrow{a} + \\overrightarrow{b}) = k\\overrightarrow{a} + k\\overrightarrow{b}",
  mathm5_2: "\\text{k}",
  mathm5_3: "k(\\overrightarrow{a} + \\overrightarrow{b}) = k\\overrightarrow{a} + k\\overrightarrow{b}",
  mathm5_4: "\\overrightarrow{a},\\overrightarrow{b}",
  mathm5_5: "\\text{k}",
  mathm5_6: "k(\\overrightarrow{a} + \\overrightarrow{b}) = k\\overrightarrow{a} + k\\overrightarrow{b}",
  mathm5_7: "\\overrightarrow{a},\\overrightarrow{b}",
  mathm5_8: "\\text{k}",
  mathm5_9: "k(\\overrightarrow{a} + \\overrightarrow{b}) = k\\overrightarrow{a} + k\\overrightarrow{b}",
  mathm6_1: "\\alpha",
  mathm6_2: "\\sin(90^\\circ - \\alpha) = \\cos \\alpha",
  mathm6_3: "\\sin(90^\\circ - \\alpha) = \\sin \\alpha",
  mathm6_4: "\\sin(90^\\circ - \\alpha) = -\\sin \\alpha",
  mathm6_5: "\\sin(90^\\circ - \\alpha) = -\\cos \\alpha",
  mathm7_1: "\\alpha",
  mathm7_2: "\\cos(180^\\circ - \\alpha) = \\cos \\alpha",
  mathm7_3: "\\cos(180^\\circ - \\alpha) = \\sin \\alpha",
  mathm7_4: "\\cos(180^\\circ - \\alpha) = -\\cos \\alpha",
  mathm7_5: "\\cos(180^\\circ - \\alpha) = -\\sin \\alpha",
  mathm8_1: "\\text{G}",
  mathm8_2: "\\bigtriangleup ABC",
  mathm8_3: "\\text{M}",
  mathm8_4: "\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC} = \\overrightarrow{0}",
  mathm8_5: "\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC} = \\overrightarrow{MG}",
  mathm8_6: "\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC} = 2 \\overrightarrow{MG}",
  mathm8_7: "\\overrightarrow{MA} + \\overrightarrow{MB} + \\overrightarrow{MC} = 3MG",
  mathm9_1: "\\text{ABC}",
  mathm9_2: "\\text{R}",
  mathm9_3: "\\frac{BC}{\\sin A} = 2R",
  mathm9_4: "\\frac{BC}{\\cos A} = 2R",
  mathm9_5: "\\frac{AB}{\\cos A} = 2R",
  mathm9_6: "\\frac{AB}{\\sin A} = 2R",
};

// Compiled regex for better performance
const MATH_PLACEHOLDER_REGEX = /\[:\$([^$]+)\$\]/g;
const HAS_MATH_REGEX = /\[:\$[^$]+\$\]/;

// Cache for KaTeX rendered HTML to avoid re-rendering
const katexCache = new Map<string, string>();

// Helper function to render KaTeX with caching
const renderKaTeX = (mathValue: string): string => {
  if (katexCache.has(mathValue)) {
    return katexCache.get(mathValue)!;
  }
  try {
    const html = katex.renderToString(mathValue, {
      throwOnError: false,
      displayMode: false,
    });
    katexCache.set(mathValue, html);
    return html;
  } catch (error) {
    return "";
  }
};

// Helper function to check if text contains math placeholders (optimized)
const hasMathPlaceholder = (text: string): boolean => {
  if (!text) return false;
  return HAS_MATH_REGEX.test(text);
};

// Memoized component for parsed math content
const ParsedMathContent = memo<{ text: string }>(({ text }) => {
  const parsedContent = useMemo(() => {
    if (!text) return [];

    const regex = new RegExp(MATH_PLACEHOLDER_REGEX.source, "g");
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        if (textBefore) {
          parts.push(textBefore);
        }
      }

      // Replace placeholder with KaTeX or HTML
      const mathKey = match[1];
      const mathValue = MATH_DATA[mathKey];
      const uniqueKey = `math-${mathKey}-${keyCounter++}`;

      if (mathValue) {
        // If it's HTML (contains <b>, <i>, etc.), render as HTML
        if (mathValue.trim().startsWith("<") || mathValue.includes("<b>") || mathValue.includes("<i>")) {
          parts.push(<span key={uniqueKey} dangerouslySetInnerHTML={{ __html: mathValue }} />);
        } else {
          // Render as KaTeX inline math with caching
          const html = renderKaTeX(mathValue);
          if (html) {
            parts.push(<span key={uniqueKey} dangerouslySetInnerHTML={{ __html: html }} />);
          } else {
            parts.push(<span key={uniqueKey} className="text-red-500">[Math Error: {mathKey}]</span>);
          }
        }
      } else {
        // If not found, show placeholder
        parts.push(<span key={uniqueKey} className="text-yellow-600">[Missing: {mathKey}]</span>);
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        parts.push(remainingText);
      }
    }

    // If no matches found, return the original text
    if (parts.length === 0) {
      return [text];
    }

    return parts;
  }, [text]);

  return <>{parsedContent}</>;
});

ParsedMathContent.displayName = "ParsedMathContent";

// Helper function to parse content (kept for backward compatibility, but now uses component)
const parseContentWithMath = (text: string): React.ReactNode => {
  return <ParsedMathContent text={text} />;
};

export default function ExamEditorPage() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const classId = params?.id as string;

  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [examTitle, setExamTitle] = useState("Kiểm tra 15 phút - Toán Đại Số - Lớp 12");
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [maxScore, setMaxScore] = useState(10);
  const [totalQuestions, setTotalQuestions] = useState(40);
  const [status, setStatus] = useState("draft");
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);

  // Initialize with new data structure
  const [partsData, setPartsData] = useState<PartData[]>([
    {
      name: "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn.",
      questions: [
        {
          id: "1",
          question: "Mệnh đề toán học nào sau đây là mệnh đề sai?",
          answers: [
            { key: "A", content: "Số 2 là số nguyên." },
            { key: "B", content: "Số 2 là số hữu tỉ." },
            { key: "C", content: "Số 2 là số hữu tỉ dương." },
            { key: "D", content: "Số 2 không là số nguyên tố." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "2",
          question: "Cho hai tập hợp [:$mathm2_1$] và [:$mathm2_2$]. Tập hợp [:$mathm2_3$] là",
          answers: [
            { key: "A", content: "tập hợp tất cả các phần tử thuộc [:$mathm2_4$] hoặc thuộc [:$mathm2_5$]." },
            { key: "B", content: "tập hợp tất cả các phần tử vừa thuộc [:$mathm2_6$] vừa thuộc [:$mathm2_7$]." },
            { key: "C", content: "tập hợp các phần tử thuộc [:$mathm2_8$] nhưng không thuộc [:$mathm2_9$]." },
            { key: "D", content: "tập hợp tất cả các phần tử thuộc [:$mathm2_10$] nhưng không thuộc [:$mathm2_11$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "3",
          question: "Tập hợp rỗng là",
          answers: [
            { key: "A", content: "tập hợp có đúng 1 phần tử." },
            { key: "B", content: "tập hợp có đúng 2 phần tử." },
            { key: "C", content: "tập hợp có vô số phần tử." },
            { key: "D", content: "tập hợp không có phần tử nào." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "4",
          question:
            "Cho hai tập hợp [:$mathm4_1$] và [:$mathm4_2$] khác [:$mathm4_3$]. Tập hợp [:$mathm4_4$] là tập hợp con của tập hợp [:$mathm4_5$] khi và chỉ khi",
          answers: [
            { key: "A", content: "có một phần tử của [:$mathm4_6$] là phần tử của [:$mathm4_7$]." },
            { key: "B", content: "mọi phần tử của [:$mathm4_8$] đều là phần tử của [:$mathm4_9$]." },
            { key: "C", content: "mọi phần tử của [:$mathm4_10$] đều là phần tử của [:$mathm4_11$]." },
            { key: "D", content: "hiệu của [:$mathm4_12$] và [:$mathm4_13$] là tập hợp khác rỗng." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "5",
          question: "Phát biểu nào nào sau đây là đúng?",
          answers: [
            { key: "A", content: "Với hai vectơ bất kì [:$mathm5_1$] và số thực [:$mathm5_2$], ta có: [:$mathm5_3$]." },
            { key: "B", content: "Với hai vectơ bất kì [:$mathm5_4$] và số thực [:$mathm5_5$], ta có: [:$mathm5_6$]." },
            { key: "C", content: "Với hai vectơ bất kì [:$mathm5_7$] và số thực [:$mathm5_8$], ta có: [:$mathm5_9$]." },
            { key: "D", content: "Với hai vectơ bất kì [:$mathm5_10$] và số thực [:$mathm5_11$], ta có: [:$mathm5_12$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "6",
          question: "Cho góc nhọn [:$mathm6_1$] tùy ý. Phát biểu nào sau đây là đúng?",
          answers: [
            { key: "A", content: "[:$mathm6_2$]." },
            { key: "B", content: "[:$mathm6_3$]." },
            { key: "C", content: "[:$mathm6_4$]." },
            { key: "D", content: "[:$mathm6_5$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "7",
          question: "Cho góc nhọn [:$mathm7_1$] tùy ý. Phát biểu nào sau đây là đúng?",
          answers: [
            { key: "A", content: "[:$mathm7_2$]." },
            { key: "B", content: "[:$mathm7_3$]." },
            { key: "C", content: "[:$mathm7_4$]." },
            { key: "D", content: "[:$mathm7_5$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "8",
          question: "Cho [:$mathm8_1$] là trọng tâm [:$mathm8_2$] và điểm [:$mathm8_3$] tùy ý. Phát biểu nào sau đây là đúng?",
          answers: [
            { key: "A", content: "[:$mathm8_4$]." },
            { key: "B", content: "[:$mathm8_5$]." },
            { key: "C", content: "[:$mathm8_6$]." },
            { key: "D", content: "[:$mathm8_7$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "9",
          question: "Cho tam giác nhọn [:$mathm9_1$] nội tiếp đường tròn bán kính [:$mathm9_2$]. Phát biểu nào sau đây là đúng?",
          answers: [
            { key: "A", content: "[:$mathm9_3$]." },
            { key: "B", content: "[:$mathm9_4$]." },
            { key: "C", content: "[:$mathm9_5$]." },
            { key: "D", content: "[:$mathm9_6$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "10",
          question: "Cho tam giác [:$mathm10_1$]. Phát biểu nào sau đây là đúng?",
          answers: [
            { key: "A", content: "[:$mathm10_2$]" },
            { key: "B", content: "[:$mathm10_3$]" },
            { key: "C", content: "[:$mathm10_4$]" },
            { key: "D", content: "[:$mathm10_5$]" },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "11",
          question:
            "Cho đoạn thẳng [:$mathm11_1$] và hai điểm [:$mathm11_2$] thuộc đoạn thẳng [:$mathm11_3$] sao cho: [:$mathm11_4$]. Phát biểu nào sau đây là đúng?",
          answers: [
            { key: "A", content: "[:$mathm11_5$]." },
            { key: "B", content: "[:$mathm11_6$]." },
            { key: "C", content: "[:$mathm11_7$]." },
            { key: "D", content: "[:$mathm11_8$]." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
        {
          id: "12",
          question:
            "Cho hệ bất phương trình bậc nhất hai ẩn\n[:$mathm12_1$]\ncó miền nghiệm được biểu diễn là hình tứ giác [:$mathm12_2$] (tham khảo hình vẽ).\n\\includegraphics[max width=\\linewidth,keepaspectratio]{media/image31.jpeg}\nGiá trị lớn nhất của biểu thức [:$mathm12_3$] bằng bao nhiêu?",
          answers: [
            { key: "A", content: "6 ." },
            { key: "B", content: "7 ." },
            { key: "C", content: "8 ." },
            { key: "D", content: "5 ." },
          ],
          correct_answer: { A: false, B: false, C: false, D: false },
        },
      ],
    },
    {
      name: "PHẦN II. Câu trắc nghiệm đúng sai.",
      questions: [
        {
          id: "1",
          question:
            "Một cuộc thi bắn cung có 20 người tham gia. Trong lần bắn đầu tiên có 18 người bắn trúng mục tiêu. Trong lần bắn thứ hai có 15 người bắn trúng mục tiêu. Trong lần bắn thứ ba chỉ còn 10 người bắn trúng mục tiêu.",
          answers: [
            { key: "A", content: "Số người bắn trượt mục tiêu trong lần đầu tiên là 2 ." },
            { key: "B", content: "Số người bắn trượt mục tiêu trong lần bắn thứ hai là 6 ." },
            { key: "C", content: "Số người bắn trượt mục tiêu trong lần bắn thứ nhất và thứ hai nhiều nhất là 8 ." },
            { key: "D", content: "Số người bắn trúng mục tiêu trong cả ba lần bắn ít nhất là 3." },
          ],
          correct_answer: { B: false, C: false },
        },
        {
          id: "2",
          question:
            "Cho tứ giác [:$mathm14_1$] có [:$mathm14_2$] lần lượt là trung điểm của các cạnh [:$mathm14_3$]. Gọi [:$mathm14_4$] là trung điểm của đoạn thẳng [:$mathm14_5$] và [:$mathm14_6$] là trọng tâm tam giác [:$mathm14_7$].",
          answers: [
            { key: "A", content: "[:$mathm14_8$]." },
            { key: "B", content: "[:$mathm14_9$]." },
            { key: "C", content: "[:$mathm14_10$]." },
            { key: "D", content: "[:$mathm14_11$]." },
          ],
          correct_answer: { B: false, C: false, D: false },
        },
        {
          id: "3",
          question:
            "Cho hình bình hành [:$mathm15_1$]. Gọi [:$mathm15_2$] là giao điểm của [:$mathm15_3$] và [:$mathm15_4$] (Hình bên).\n\\includegraphics[max width=\\linewidth,keepaspectratio]{media/image48.jpeg}",
          answers: [
            { key: "A", content: "[:$mathm15_5$] và [:$mathm15_6$] là hai vectơ đối nhau." },
            { key: "B", content: "[:$mathm15_7$] và [:$mathm15_8$] là hai vectơ đối nhau." },
            { key: "C", content: "[:$mathm15_9$]." },
            { key: "D", content: "[:$mathm15_10$]." },
          ],
          correct_answer: { B: false },
        },
        {
          id: "4",
          question: "Lớp 10A có 40 học sinh, trong đó có 27 học sinh tham gia câu lạc bộ bóng rổ và 25 học sinh tham gia câu lạc bộ bóng đá.",
          answers: [
            { key: "A", content: "Số học sinh tham gia câu lạc bộ bóng rổ hoặc tham gia câu lạc bộ bóng đá nhiều nhất là 40." },
            { key: "B", content: "Số học sinh tham gia cả hai câu lạc bộ bóng rổ và bóng đá ít nhất là 10." },
            { key: "C", content: "Số học sinh không tham gia cả hai câu lạc bộ bóng rổ và bóng đá ít nhất là 1." },
            { key: "D", content: "Số học sinh không tham gia cả hai câu lạc bộ bóng rổ và bóng đá nhiều nhất là 10." },
          ],
          correct_answer: { B: false, C: false, D: false },
        },
      ],
    },
    {
      name: "PHẦN III. Câu trắc nghiệm trả lời ngắn.",
      questions: [
        {
          id: "1",
          question: "Cho hình chữ nhật [:$mathm17_1$] có [:$mathm17_2$]. Độ dài của vectơ [:$mathm17_3$] bằng bao nhiêu?",
          answers: [{ key: "A", content: "10" }],
          correct_answer: { A: false },
        },
        {
          id: "2",
          question:
            "Để đo khoảng cách từ vị trí [:$mathm18_1$] đến vị trí [:$mathm18_2$] ở hai bên bờ hồ, bạn Hà tiến hành đo khoảng cách [:$mathm18_3$] và các góc [:$mathm18_4$]. Kết quả nhận được là: [:$mathm18_5$] và [:$mathm18_6$] (Hình bên). Khoảng cách từ vị trí [:$mathm18_7$] đến vị trí [:$mathm18_8$] là bao nhiêu mét (làm tròn kết quả đến hàng đơn vị của mét)?\n\\includegraphics[max width=\\linewidth,keepaspectratio]{media/image66.jpeg}",
          answers: [{ key: "A", content: "31" }],
          correct_answer: { A: false },
        },
        {
          id: "3",
          question:
            "Hai tàu đánh cá cùng xuất phát từ bến [:$mathm19_1$] và đi về hai vùng biển khác nhau theo hai nửa đường thẳng tạo với nhau một góc [:$mathm19_2$]. Tàu thứ nhất chạy với tốc độ 8 hải lí một giờ và tàu thứ hai chạy với tốc độ 12 hải lí một giờ. Sau đúng 2 giờ thì khoảng cách giữa hai tàu là bao nhiêu hải lí (làm tròn kết quả đến hàng đơn vị của hải lí)?",
          answers: [{ key: "A", content: "21" }],
          correct_answer: { A: false },
        },
        {
          id: "4",
          question:
            "Có 100 tấm thẻ được đánh số thứ tự từ 1 đến 100 và được đặt ngửa trên bàn. Người ta lật ngược các tấm thẻ như sau:\nLần thứ nhất, lật ngược tất cả các tấm thẻ có số thứ tự chia hết cho 2.\nLần thứ hai, lật ngược tất cả các tấm thẻ có số thứ tự chia hết cho 5 .\nHỏi sau lần thứ hai, có bao nhiêu tấm thẻ được đặt sấp. Biết rằng, khi bị lật ngược, thẻ đang ngửa sẽ thành sấp và thẻ đang sấp sẽ thành ngửa.",
          answers: [{ key: "A", content: "50" }],
          correct_answer: { A: false },
        },
        {
          id: "5",
          question:
            "Để chế biến một hộp thực phẩm [:$mathm21_1$] cần [:$mathm21_2$] cà chua và [:$mathm21_3$] thịt; một hộp thực phẩm [:$mathm21_4$] cần [:$mathm21_5$] cà chua và [:$mathm21_6$] thịt. Lợi nhuận thu được từ 1 hộp thực phẩm [:$mathm21_7$] và 1 hộp thực phẩm [:$mathm21_8$] lần lượt là 4000 đồng và 5000 đồng. Chị Hoa có [:$mathm21_9$] cà chua và [:$mathm21_10$] thịt để sản xuất các hộp thực phẩm [:$mathm21_11$] và [:$mathm21_12$]. Với lượng nguyên liệu như trên, lợi nhuận lớn nhất chị Hoa có thể thu được là bao nhiêu nghìn đồng?",
          answers: [{ key: "A", content: "45" }],
          correct_answer: { A: false },
        },
        {
          id: "6",
          question:
            "Một xưởng sản xuất bàn và ghế. Thời gian để một công nhân hoàn thiện 1 chiếc bàn và 1 chiếc ghế lần lượt là 120 phút và 30 phút. Xưởng có 4 công nhân, mỗi công nhân làm việc không quá 6 tiếng mỗi ngày. Biết rằng sản phẩm của xưởng luôn được tiêu thụ hết, mỗi chiếc bàn lãi 200 nghì đồng, mỗi chiếc ghế lãi 75 nghì đồng và số ghế không vượt quá 4 lần số bàn. Trong một ngày sản xuất, xưởng có thể thu được lợi nhuận lớn nhất là bao nhiêu tiền? Viết câu trả lời theo đơn vị triệu đồng.",
          answers: [{ key: "A", content: "3" }],
          correct_answer: { A: false },
        },
      ],
    },
  ]);

  const handleSave = useCallback(() => {
    message.success("Lưu đề thi thành công!");
  }, [message]);

  const handleCancel = useCallback(() => {
    router.push(`/admin/classes/${classId}/examinate`);
  }, [router, classId]);

  const handleAddQuestion = useCallback(() => {
    setShowQuestionTypeModal(true);
  }, []);

  const handleCreateQuestion = useCallback((type: "multiple_choice" | "true_false" | "fill_blank") => {
    setPartsData((prev) => {
      const newParts = [...prev];
      // Add to first part for now (can be enhanced to select part)
      if (newParts.length > 0) {
        const partIndex = 0;
        const newQuestion: QuestionItem = {
          id: String(Date.now()),
          question: "",
          answers:
            type === "fill_blank"
              ? [{ key: "A", content: "" }]
              : type === "true_false"
              ? [
                  { key: "A", content: "" },
                  { key: "B", content: "" },
                ]
              : [
                  { key: "A", content: "" },
                  { key: "B", content: "" },
                ],
          correct_answer: type === "fill_blank" ? { A: false } : type === "true_false" ? { A: false, B: false } : { A: false, B: false },
        };
        newParts[partIndex].questions.push(newQuestion);
      }
      return newParts;
    });
    setShowQuestionTypeModal(false);
  }, []);

  const handleDeleteQuestion = useCallback((partIndex: number, questionId: string) => {
    setPartsData((prev) => {
      const newParts = [...prev];
      if (newParts[partIndex]) {
        newParts[partIndex] = {
          ...newParts[partIndex],
          questions: newParts[partIndex].questions.filter((q) => q.id !== questionId),
        };
      }
      return newParts;
    });
  }, []);

  const handleUpdateQuestion = useCallback((partIndex: number, questionId: string, field: keyof QuestionItem, value: any) => {
    setPartsData((prev) => {
      const newParts = [...prev];
      if (newParts[partIndex]) {
        newParts[partIndex] = {
          ...newParts[partIndex],
          questions: newParts[partIndex].questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
        };
      }
      return newParts;
    });
  }, []);

  const handleUpdateAnswer = useCallback((partIndex: number, questionId: string, answerIndex: number, field: string, value: any) => {
    setPartsData((prev) => {
      const newParts = [...prev];
      if (newParts[partIndex]) {
        newParts[partIndex] = {
          ...newParts[partIndex],
          questions: newParts[partIndex].questions.map((q) => {
            if (q.id === questionId) {
              const newAnswers = [...q.answers];
              newAnswers[answerIndex] = { ...newAnswers[answerIndex], [field]: value };
              return { ...q, answers: newAnswers };
            }
            return q;
          }),
        };
      }
      return newParts;
    });
  }, []);

  const handleAddAnswer = useCallback((partIndex: number, questionId: string) => {
    setPartsData((prev) => {
      const newParts = [...prev];
      if (newParts[partIndex]) {
        newParts[partIndex] = {
          ...newParts[partIndex],
          questions: newParts[partIndex].questions.map((q) => {
            if (q.id === questionId) {
              const nextKey = String.fromCharCode(65 + q.answers.length); // A, B, C, D...
              const newAnswer: Answer = { key: nextKey, content: "" };
              return {
                ...q,
                answers: [...q.answers, newAnswer],
                correct_answer: { ...q.correct_answer, [nextKey]: false },
              };
            }
            return q;
          }),
        };
      }
      return newParts;
    });
  }, []);

  const handleRemoveAnswer = useCallback((partIndex: number, questionId: string, answerIndex: number) => {
    setPartsData((prev) => {
      const newParts = [...prev];
      if (newParts[partIndex]) {
        newParts[partIndex] = {
          ...newParts[partIndex],
          questions: newParts[partIndex].questions.map((q) => {
            if (q.id === questionId) {
              const removedAnswer = q.answers[answerIndex];
              const newAnswers = q.answers.filter((_, index) => index !== answerIndex);
              const newCorrectAnswer = { ...q.correct_answer };
              delete newCorrectAnswer[removedAnswer.key];
              return {
                ...q,
                answers: newAnswers,
                correct_answer: newCorrectAnswer,
              };
            }
            return q;
          }),
        };
      }
      return newParts;
    });
  }, []);

  const handleSelectAnswer = useCallback((partIndex: number, questionId: string, answerIndex: number) => {
    setPartsData((prev) => {
      const newParts = [...prev];
      if (newParts[partIndex]) {
        newParts[partIndex] = {
          ...newParts[partIndex],
          questions: newParts[partIndex].questions.map((q) => {
            if (q.id === questionId) {
              const selectedAnswer = q.answers[answerIndex];
              // For multiple choice: only one correct answer
              // For true_false: can have multiple correct answers
              const questionType = getQuestionType(newParts[partIndex].name);
              const newCorrectAnswer: Record<string, boolean> = {};

              if (questionType === "multiple_choice") {
                // Set all to false, then set selected to true
                q.answers.forEach((ans) => {
                  newCorrectAnswer[ans.key] = false;
                });
                newCorrectAnswer[selectedAnswer.key] = true;
              } else if (questionType === "true_false") {
                // Toggle the selected answer
                newCorrectAnswer[selectedAnswer.key] = !q.correct_answer[selectedAnswer.key];
                // Keep other answers' states
                q.answers.forEach((ans) => {
                  if (ans.key !== selectedAnswer.key) {
                    newCorrectAnswer[ans.key] = q.correct_answer[ans.key] || false;
                  }
                });
              } else {
                // fill_blank: just update the answer
                newCorrectAnswer[selectedAnswer.key] = true;
              }

              return { ...q, correct_answer: newCorrectAnswer };
            }
            return q;
          }),
        };
      }
      return newParts;
    });
  }, []);

  // Generate LaTeX source from partsData
  const generateLatexSource = useCallback((): string => {
    let latex = "";

    // Generate LaTeX for each part
    partsData.forEach((part) => {
      latex += `${part.name}\n`;
      latex += `Trả lời các câu hỏi từ 1 đến ${part.questions.length}, chọn một phương án đúng cho mỗi câu.\n\n`;

      part.questions.forEach((question, index) => {
        latex += `Câu ${index + 1}. ${question.question}\n`;

        const questionType = getQuestionType(part.name);

        if (questionType === "true_false") {
          question.answers.forEach((answer) => {
            const isCorrect = question.correct_answer[answer.key] === true;
            const marker = isCorrect ? "*" : "×";
            latex += `${marker}${answer.key}. ${answer.content} - ${isCorrect ? "Đúng" : "Sai"}\n`;
          });
        } else if (questionType === "fill_blank") {
          latex += `Đáp án: ${question.answers[0]?.content || ""}\n`;
        } else {
          // multiple_choice
          question.answers.forEach((answer) => {
            const isCorrect = question.correct_answer[answer.key] === true;
            const marker = isCorrect ? "*" : "";
            latex += `${marker}${answer.key}. ${answer.content}\n`;
          });
        }

        latex += `% End of Question ${index + 1}\n\n`;
      });
    });

    return latex;
  }, [partsData]);

  const [latexSource, setLatexSource] = useState("");

  // Update LaTeX source when questions change
  useEffect(() => {
    setLatexSource(generateLatexSource());
  }, [generateLatexSource]);

  const latexLines = useMemo(() => latexSource.split("\n"), [latexSource]);
  const totalLines = latexLines.length;

  const handleLatexChange = useCallback((value: string) => {
    setLatexSource(value);
  }, []);

  // Calculate total questions count
  const totalQuestionsCount = useMemo(() => {
    return partsData.reduce((sum, part) => sum + part.questions.length, 0);
  }, [partsData]);

  // Update totalQuestions when partsData changes
  useEffect(() => {
    setTotalQuestions(totalQuestionsCount);
  }, [totalQuestionsCount]);

  const handleLineNumbersScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const diff = Math.abs(textareaRef.current.scrollTop - lineNumbersRef.current.scrollTop);
      if (diff > 1) {
        textareaRef.current.scrollTop = lineNumbersRef.current.scrollTop;
      }
    }
  }, []);

  const handleTextareaScroll = useCallback(() => {
    if (lineNumbersRef.current && textareaRef.current) {
      const diff = Math.abs(lineNumbersRef.current.scrollTop - textareaRef.current.scrollTop);
      if (diff > 1) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
  }, []);

  // Memoize callbacks for GeneralConfig
  const handleTimeChange = useCallback((value: number | null) => {
    setTimeMinutes(value || 0);
  }, []);

  const handleMaxScoreChange = useCallback((value: number | null) => {
    setMaxScore(value || 0);
  }, []);

  const handleTotalQuestionsChange = useCallback((value: number | null) => {
    setTotalQuestions(value || 0);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
  }, []);

  const handleExamTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExamTitle(e.target.value);
  }, []);

  return (
    <div className="bg-gray-50/50 h-full flex flex-col space-y-3 overflow-hidden">
      <style jsx global>{`
        /* Custom Scrollbar for Main Content */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} className="text-blue-600 hover:text-blue-700 border-none shadow-none">
              Quay lại
            </Button>
            <Input
              value={examTitle}
              onChange={handleExamTitleChange}
              className="text-base font-medium border-gray-200 rounded-md"
              style={{ width: "500px" }}
              placeholder="Nhập tên đề thi..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Lưu đề thi
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Main Content Area */}
          <div className="h-full overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {/* General Configuration */}
            <GeneralConfig
              timeMinutes={timeMinutes}
              maxScore={maxScore}
              totalQuestions={totalQuestions}
              status={status}
              onTimeChange={handleTimeChange}
              onMaxScoreChange={handleMaxScoreChange}
              onTotalQuestionsChange={handleTotalQuestionsChange}
              onStatusChange={handleStatusChange}
            />

            {/* Questions Section */}
            {partsData.map((part, partIndex) => (
              <div key={partIndex} className="space-y-6">
                {/* Part Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-blue-600">{part.name}</h3>
                    <Button type="link" icon={<StarOutlined />} className="text-blue-600 p-0 h-auto">
                      Cố định câu hỏi
                    </Button>
                  </div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion} className="bg-blue-600">
                    Thêm câu hỏi
                  </Button>
                </div>

                {/* Questions List */}
                {part.questions.map((question, questionIndex) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    partIndex={partIndex}
                    partName={part.name}
                    questionIndex={questionIndex}
                    onUpdate={handleUpdateQuestion}
                    onDelete={handleDeleteQuestion}
                    onAddAnswer={handleAddAnswer}
                    onUpdateAnswer={handleUpdateAnswer}
                    onRemoveAnswer={handleRemoveAnswer}
                    onSelectAnswer={handleSelectAnswer}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Sidebar - LaTeX Source */}
          <LatexEditor
            latexSource={latexSource}
            latexLines={latexLines}
            totalLines={totalLines}
            onLatexChange={handleLatexChange}
            lineNumbersRef={lineNumbersRef}
            textareaRef={textareaRef}
            onLineNumbersScroll={handleLineNumbersScroll}
            onTextareaScroll={handleTextareaScroll}
          />
        </div>
      </div>

      {/* Modal chọn loại câu hỏi */}
      <Modal title="Chọn loại câu hỏi" open={showQuestionTypeModal} onCancel={() => setShowQuestionTypeModal(false)} footer={null} width={600}>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            onClick={() => handleCreateQuestion("multiple_choice")}
          >
            <div className="text-center">
              <FileTextOutlined className="text-3xl text-blue-600 mb-2" />
              <div className="font-semibold text-gray-800">Trắc nghiệm</div>
              <div className="text-sm text-gray-500 mt-1">Nhiều phương án lựa chọn</div>
            </div>
          </div>
          <div
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
            onClick={() => handleCreateQuestion("true_false")}
          >
            <div className="text-center">
              <InfoCircleOutlined className="text-3xl text-orange-600 mb-2" />
              <div className="font-semibold text-gray-800">Đúng/Sai</div>
              <div className="text-sm text-gray-500 mt-1">Nhiều câu hỏi, chọn Đúng/Sai</div>
            </div>
          </div>
          <div
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
            onClick={() => handleCreateQuestion("fill_blank")}
          >
            <div className="text-center">
              <FileTextOutlined className="text-3xl text-green-600 mb-2" />
              <div className="font-semibold text-gray-800">Tự luận</div>
              <div className="text-sm text-gray-500 mt-1">Điền đáp án vào ô trống</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
