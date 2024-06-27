import {
  faCircleUser,
  faCircleXmark,
  faEnvelope,
  faFile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import toTitle from "src/utils/toTitle";
import shortDate from "src/utils/shortDate";

export default function PendingItem({ data }) {
  return (
    <article className="message mb-2 pending-item-card">
      <div className="message-header pending-item-header">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={faFile} />
          </span>
          <span className="">{toTitle(data.itemName)}</span>
        </span>
        <span className="icon tag-button">
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>
      </div>

      <div className="message-body">
        <div className="content is-small mb-4">
          <p>{`Created at: ${shortDate(data.createdAt)}`}</p>
          <h4>
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faCircleUser} />
              </span>
              <span>{toTitle(data.controlOwner)}</span>
            </span>
          </h4>
          <p>{toTitle(data.description, true)}</p>
        </div>
        <div className="pending-item-footer">
          <span className="tag is-dark">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span>
                {(data.lastContact && shortDate(data.lastContact)) ||
                  "No Contact"}
              </span>
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
