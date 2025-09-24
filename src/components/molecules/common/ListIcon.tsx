const ListIcon = (props) => {
  return (
    <svg width={60} height={60} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 17H13M5 12H19M11 7H19"
        stroke={props.stroke || "#fff"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ListIcon;
