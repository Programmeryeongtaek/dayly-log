const KeywordChip = ({
  keyword,
}: {
  keyword: { id: string; name: string; color: string };
}) => (
  <span
    className="inline-flex items-center px-2 py-1 text-xs rounded-full"
    style={{
      backgroundColor: `${keyword.color}20`,
      color: keyword.color,
      borderColor: keyword.color,
      border: '1px solid',
    }}
  >
    #{keyword.name}
  </span>
);

export default KeywordChip;
