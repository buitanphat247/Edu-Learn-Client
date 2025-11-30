import { Card, Row, Col, Statistic } from "antd";

const stats = [
  { title: "Người dùng", value: "10,000+", suffix: "" },
  { title: "Khóa học", value: "500+", suffix: "" },
  { title: "Giảng viên", value: "100+", suffix: "" },
  { title: "Tỷ lệ hài lòng", value: "98", suffix: "%" },
];

const values = [
  {
    title: "Sứ mệnh",
    description: "Mang đến nền tảng học tập số hiện đại, giúp mọi người tiếp cận kiến thức một cách dễ dàng và hiệu quả.",
  },
  {
    title: "Tầm nhìn",
    description: "Trở thành nền tảng học tập số hàng đầu tại Việt Nam, kết nối người học với tri thức toàn cầu.",
  },
  {
    title: "Giá trị cốt lõi",
    description: "Chất lượng, đổi mới, và cam kết mang lại trải nghiệm học tập tốt nhất cho người dùng.",
  },
];

export default function About() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Về chúng tôi</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Thư viện số - Nền tảng học tập và tài liệu trực tuyến, mang đến cho bạn kho tài liệu phong phú và các khóa học chất lượng cao.
        </p>
      </div>

      <div className="mb-16">
        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <Card className="text-center shadow-md">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    styles={{ content: { color: "#1c91e3", fontSize: "32px", fontWeight: "bold" } }}
                  />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sứ mệnh & Tầm nhìn</h2>
        <Row gutter={[24, 24]}>
          {values.map((value, index) => (
            <Col xs={24} md={8} key={index}>
              <Card hoverable className="h-full shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tại sao chọn chúng tôi?</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card hoverable className="shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nội dung chất lượng</h3>
              <p className="text-gray-600">
                Chúng tôi hợp tác với các giảng viên và chuyên gia hàng đầu để mang đến nội dung học tập chất lượng cao, cập nhật và thực tế.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Công nghệ tiên tiến</h3>
              <p className="text-gray-600">
                Sử dụng AI và công nghệ hiện đại để cá nhân hóa trải nghiệm học tập, giúp bạn học hiệu quả hơn.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi để đảm bảo trải nghiệm học tập tốt nhất.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable className="shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Giá cả hợp lý</h3>
              <p className="text-gray-600">
                Chỉ với 35k/tháng, bạn có thể truy cập tất cả các tính năng premium và nội dung học tập đa dạng.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-gray-600 mb-6">
          Bạn có câu hỏi hoặc muốn tìm hiểu thêm? Hãy liên hệ với chúng tôi!
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>info@edulearning.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+84 123 456 789</span>
          </div>
        </div>
      </div>
    </main>
  );
}

