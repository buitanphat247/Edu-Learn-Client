"use client";

import { Card } from "antd";

const MoneyIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const WriteIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const HeadphoneIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
);

const features = [
  {
    icon: <MoneyIcon />,
    title: "Chi phí hợp lý, đa ngôn ngữ",
    description: ["Chỉ 35k/tháng cho tất cả tính năng premium và hỗ trợ 4 ngôn ngữ.", "Tiếng Anh, Trung, Nhật, Hàn - một tài khoản học tất cả."],
  },
  {
    icon: <BrainIcon />,
    title: "Học từ vựng thông minh",
    description: ["AI phân tích tiến độ và tạo bài tập phù hợp với khả năng của bạn.", "Flashcards và mini-games giúp ghi nhớ từ vựng hiệu quả hơn."],
  },
  {
    icon: <WriteIcon />,
    title: "Luyện viết với AI hỗ trợ",
    description: ["Dịch và viết câu từ tiếng Việt sang 5 ngôn ngữ với AI thông minh.", "Nhận phản hồi ngữ pháp và từ vựng ngay lập tức."],
  },
  {
    icon: <HeadphoneIcon />,
    title: "Luyện nghe, nói và đồng bộ",
    description: [
      "Audio clips với transcript và kỹ thuật shadowing luyện phát âm tự nhiên.",
      "Lưu từ vựng từ extension, một click dịch, đồng bộ mọi nơi.",
    ],
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span>Tại sao nên sử dụng Thư viện số?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              hoverable
              className="h-full shadow-sm"
              styles={{
                body: { padding: "24px" },
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0 text-[#1c91e3]">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <div className="space-y-2">
                    {feature.description.map((line, idx) => (
                      <p key={idx} className="text-gray-500 text-sm leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
