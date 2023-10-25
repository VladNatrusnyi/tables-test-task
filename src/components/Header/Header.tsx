import React, {FC, useState} from "react";
import styles from './Header.module.css'
import {FaFilter} from "react-icons/fa";
import {Modal} from "antd";
import {useAppSelector} from "../../helpers/redux-hook";
import {FilterForm} from "../FilterForm/FilterForm";
export const Header: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isLoggedIn } = useAppSelector(state => state.auth)
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

  return (
      <>
          <Modal footer={null} title="Filters" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <FilterForm />
          </Modal>

          <div className={styles.header}>
              <div className={styles.headerContainer}>
                  <div className={styles.headerBrand}>Test task</div>
                  {
                      isLoggedIn && <div className={styles.headerContent}>
                      <div onClick={showModal} className={styles.headerItem}>
                        Filter
                        <FaFilter />
                      </div>
                    </div>
                  }
              </div>
          </div>
      </>
  )
};
