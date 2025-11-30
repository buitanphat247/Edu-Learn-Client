interface FeaturesPageProps {
  params: {
    type: string;
  };
}

export default function Features({ params }: FeaturesPageProps) {
  const { type } = params;
  const titles: Record<string, string> = {
    translator: 'Dịch thuật',
    vocabulary: 'Học từ vựng',
    writing: 'Luyện viết',
    listening: 'Luyện nghe',
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {titles[type || ''] || 'Tính năng'}
      </h1>
    </main>
  );
}

