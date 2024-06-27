import {
  faCircleXmark,
  faEnvelope,
  faFile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PendingItem({ data }) {
  return (
    <article className="message mb-2 pending-item-card">
      <div className="message-header pending-item-header">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={faFile} />
          </span>
          <span className="">{data.itemName}</span>
        </span>
        <span className="icon tag-button">
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>
      </div>

      <div className="message-body">
        <div className="content is-small mb-4">
          <p>{`Created at: ${data.createdAt}`}</p>
          <h4>{data.controlOwner}</h4>
          <p>{data.description}</p>
        </div>
        <div className="pending-item-footer">
          <span className="tag is-dark">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span>{data.lastContact}</span>
            </span>
          </span>
          <span className="tag is-success tag-button">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
              <span>Follow Up</span>
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
