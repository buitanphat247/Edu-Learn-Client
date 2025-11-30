import { Modal, Form, Input, Button, Divider, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';

interface SignUpProps {
  open: boolean;
  onCancel: () => void;
  onSwitchToSignIn?: () => void;
}

export default function SignUp({ open, onCancel, onSwitchToSignIn }: SignUpProps) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Sign up:', values);
    // Xử lý đăng ký ở đây
    onCancel();
  };

  return (
    <Modal
      title="Đăng ký"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={400}
      centered
    >
      <Form
        form={form}
        name="signup"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Họ và tên"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản sử dụng
            </a>{' '}
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{ backgroundColor: '#1c91e3', borderColor: '#1c91e3' }}
          >
            Đăng ký
          </Button>
        </Form.Item>

        <Divider>Hoặc</Divider>

        <Form.Item>
          <Button
            icon={<GoogleOutlined />}
            block
            size="large"
            onClick={() => {
              // Xử lý đăng ký bằng Google
              console.log('Sign up with Google');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Đăng ký bằng Google
          </Button>
        </Form.Item>

        <div className="text-center text-gray-600">
          Đã có tài khoản?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCancel();
              onSwitchToSignIn?.();
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng nhập ngay
          </a>
        </div>
      </Form>
    </Modal>
  );
}

