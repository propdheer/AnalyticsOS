"use client";

import { titleCase } from "@/lib/format";

export type ObjectListItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  badge?: string;
};

export function ObjectList({
  items,
  emptyText,
  onDelete,
}: {
  items: ObjectListItem[];
  emptyText: string;
  onDelete?: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <div className="list">
      {items.map((item) => (
        <div className="list-item" key={item.id}>
          <div className="list-item-header">
            <div>
              <div className="list-item-title">{item.title}</div>
              {item.description ? <div className="list-item-description">{item.description}</div> : null}
              {item.meta ? <div className="list-item-meta">{titleCase(item.meta)}</div> : null}
              {item.badge ? <span className="badge">{item.badge}</span> : null}
            </div>
            <div className="list-actions">
              <span className="mini-id">{item.id}</span>
              {onDelete ? (
                <button className="button button-danger" type="button" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
