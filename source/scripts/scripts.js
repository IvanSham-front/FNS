"use strict";

const tableItems_1 = document.querySelectorAll('[data-table="1"]');
const tableLinkItem_1 = document.querySelector('#table_link_1');
const tableItems_2 = document.querySelectorAll('[data-table="2"]');
const tableLinkItem_2 = document.querySelector('#table_link_2');
const tableItems_3 = document.querySelectorAll('[data-table="3"]');
const tableLinkItem_3 = document.querySelector('#table_link_3');

function toggleColor(items, link) {
  for (let item of items) {
    item.addEventListener('mouseover', () => {
      link.style.color = '#098EDF';
    });
    item.addEventListener('mouseout', () => {
      link.style.color = '#27364B';
    });
  };
};

toggleColor(tableItems_1, tableLinkItem_1);
toggleColor(tableItems_2, tableLinkItem_2);
toggleColor(tableItems_3, tableLinkItem_3);