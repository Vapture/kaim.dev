'use client';
import React from 'react'
import styles from './style.module.scss';

export default function index({index, title, description, manageModal}) {

    return (
        <div className={styles.wrapper}>
        <div className={styles.card}>
        <div className={styles.sticker}>Modal</div>
                <div onMouseEnter={(e) => {manageModal(true, index, e.clientX, e.clientY)}} onMouseLeave={(e) => {manageModal(false, index, e.clientX, e.clientY)}} className={styles.experience}>
                    <h2>{title}</h2>
                    <p>{description}</p>
            </div>
        </div>
        </div>
    )
}
