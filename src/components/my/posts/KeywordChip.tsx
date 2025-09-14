const KeywordChip = ({
  keyword,
}: {
  keyword: { id: string; name: string; color: string };
}) => (
  <span
    className="inline-flex items-center px-2 py-1 text-xs rounded-full border"
    style={{
      backgroundColor: `${keyword.color}20`,
      borderColor: keyword.color,
      color: keyword.color,
    }}
  >
    #{keyword.name}
  </span>
);

export default KeywordChip;
