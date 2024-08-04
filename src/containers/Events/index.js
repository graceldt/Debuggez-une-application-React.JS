import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [events, setEvent] = useState(data?.events || [] );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = (events).filter((_, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });
  

  const changeType = (evtType) => {
    setCurrentPage(1);
    const ev = evtType ? data?.events.filter(event => event.type === evtType) : data?.events
    setEvent(ev)
  };
  
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null || data === undefined ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => {changeType(value)}}
          />
          <div id="events" className="ListContainer">
            
            { filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(Math.ceil(events.length / PER_PAGE) || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)} className={ currentPage === n+1 ? "active": "none" }>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
