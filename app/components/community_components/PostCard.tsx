import { Card, Avatar, Tag, Button } from "antd";
import { LikeOutlined, CommentOutlined, ShareAltOutlined } from "@ant-design/icons";

interface PostCardProps {
  id: string | number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  onCommentClick?: () => void;
}

export default function PostCard({ author, avatar, time, content, tags, likes, comments, onCommentClick }: PostCardProps) {
  return (
    <div className="mt-5  rounded-md">
      <Card styles={{ body: { padding: "0px" } }}>
        <div>
          {/* Author Info */}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-4">
              <Avatar size="large" className="bg-blue-500 shrink-0">
                {avatar}
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">{author}</div>
                <div className="text-sm text-gray-500">{time}</div>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-700 leading-relaxed text-base">{content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Tag key={index} color="blue" className="cursor-pointer hover:opacity-80">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 p-2 border-t border-gray-300">
            <Button type="text" icon={<LikeOutlined />} className="flex items-center gap-2 hover:text-blue-500">
              {likes} Thích
            </Button>
            <Button type="text" icon={<CommentOutlined />} className="flex items-center gap-2 hover:text-blue-500" onClick={onCommentClick}>
              {comments} Bình luận
            </Button>
            <Button type="text" icon={<ShareAltOutlined />} className="flex items-center gap-2 hover:text-blue-500">
              Chia sẻ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
