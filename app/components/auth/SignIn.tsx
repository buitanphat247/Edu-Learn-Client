import { Modal, Form, Input, Button, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';

interface SignInProps {
  open: boolean;
  onCancel: () => void;
  onSwitchToSignUp?: () => void;
}

export default function SignIn({ open, onCancel, onSwitchToSignUp }: SignInProps) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Sign in:', values);
    // Xử lý đăng nhập ở đây
    onCancel();
  };

  return (
    <Modal
      title="Đăng nhập"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={400}
      centered
    >
      <Form
        form={form}
        name="signin"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Quên mật khẩu?
            </a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{ backgroundColor: '#1c91e3', borderColor: '#1c91e3' }}
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider>Hoặc</Divider>

        <Form.Item>
          <Button
            icon={<GoogleOutlined />}
            block
            size="large"
            onClick={() => {
              // Xử lý đăng nhập bằng Google
              console.log('Sign in with Google');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Đăng nhập bằng Google
          </Button>
        </Form.Item>

        <div className="text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCancel();
              onSwitchToSignUp?.();
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký ngay
          </a>
        </div>
      </Form>
    </Modal>
  );
}

