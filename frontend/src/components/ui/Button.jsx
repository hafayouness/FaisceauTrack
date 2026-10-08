export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className = "",
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" && `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <span className="spinner" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
}
