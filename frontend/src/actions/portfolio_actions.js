// import axios from 'axios';
import Papa from 'papaparse';

export const RECEIVE_PORTFOLIO = 'RECEIVE_PORTFOLIO';

export const receivePortfolio = portfolio => ({
  type: RECEIVE_PORTFOLIO,
  portfolio
});

export const grabPortfolios = () => dispatch => {
  return Papa.parse(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSrmOiZN0aKz30NrPibeQ_LOlaDcYmNWwnkqNMNgI0aQF1qx9tLDtNFlfnDuZIn8BeYC2AILkPohMWr/pub?output=csv', 
    { 
      download: true,
      header: true,
      complete: res => dispatch(receivePortfolio(res)) 
    }
  )
    // .then(res => dispatch(receivePortfolio(res)))
    // .catch(err => console.log(err))
  }

// export const grabPortfolios = () => dispatch => {
//   return axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSrmOiZN0aKz30NrPibeQ_LOlaDcYmNWwnkqNMNgI0aQF1qx9tLDtNFlfnDuZIn8BeYC2AILkPohMWr/pub?output=csv')
//     .then(res => dispatch(receivePortfolio(res)))
//     .catch(err => console.log(err))
//   }