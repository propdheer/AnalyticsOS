type ObjectListItem = { id: string; title: string; description?: string; meta?: string; badge?: string };
type ObjectListProps = { items: ObjectListItem[]; emptyText: string; onDelete?: (id: string) => void };

export function ObjectList({ items, emptyText, onDelete }: ObjectListProps) {
  if (items.length === 0) return <p>{emptyText}</p>;
  return (
    <div className="list">
      {items.map((item) => (
        <div className="list-item" key={item.id}>
          <div className="list-item-header">
            <div>
              <div className="list-item-title">{item.title}</div>
              {item.description ? <div className="list-item-meta">{item.description}</div> : null}
              {item.meta ? <div className="list-item-meta">{item.meta}</div> : null}
              {item.badge ? <span className="badge">{item.badge}</span> : null}
            </div>
            {onDelete ? <button className="button button-danger" onClick={() => onDelete(item.id)}>Delete</button> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
