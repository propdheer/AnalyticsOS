type ObjectListItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
};

type ObjectListProps = {
  items: ObjectListItem[];
  emptyText: string;
};

export function ObjectList({ items, emptyText }: ObjectListProps) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <div className="list">
      {items.map((item) => (
        <div className="list-item" key={item.id}>
          <div className="list-item-title">{item.title}</div>
          {item.description ? <div className="list-item-meta">{item.description}</div> : null}
          {item.meta ? <div className="list-item-meta">{item.meta}</div> : null}
        </div>
      ))}
    </div>
  );
}
