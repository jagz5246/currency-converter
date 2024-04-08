import React, { useEffect, useState } from 'react'
import CurrencyDropdown from './CurrencyDropdown';
import { HiArrowLeft, HiArrowsRightLeft } from 'react-icons/hi2';

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [amount, setAmount] = useState(1)
    const [fromCurrency, setfromCurrency] = useState("USD")
    const [toCurrency, settoCurrency] = useState("INR")
    const [convertedAmount, setconvertedAmount] = useState(null)
    const [converting, setconverting] = useState(false)
    const [favorites, setfavorites] = useState(JSON.parse(localStorage.getItem('favorites'))||["INR", "EUR"])
    
    
    //Currencies -> 'https://api.frankfurter.app/currencies'
    const fetchCurrencies = async() => {
        try {
            const res = await fetch('https://api.frankfurter.app/currencies');
            const data = await res.json();
            setCurrencies(Object.keys(data))
        } catch (error) {
            console.log("Error Fetching",error)
        }
    }


    useEffect(()=>{
        fetchCurrencies();
    },[])
    console.log(currencies)

    //Conversion -> 'https://api.frankfurter.app/latest?amount=1&from=USD&to=INR'
    const convertCurrency = async() => {
        //conversion logic
        if(!amount) return
        setconverting(true)
        try {
            const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
            const data = await res.json();
            setconvertedAmount(data.rates[toCurrency]+ " "+ toCurrency)
        } catch (error) {
            console.log("Error Fetching",error)
        }finally{
            setconverting(false)
        }

    }
    const handleFavorite =(currency)=>{
        //Add to favorites
        let updatedFavorites = [...favorites]
        if(favorites.includes(currency)){
            updatedFavorites = updatedFavorites.filter(fav => fav!==currency)
        }
        else{
            updatedFavorites.push(currency)
        }
        setfavorites(updatedFavorites)
        localStorage.setItem("favorites",JSON.stringify(updatedFavorites))
      }

    const swapCurrencies = () => {
        setfromCurrency(toCurrency);
        settoCurrency(fromCurrency);
    }

  return (
    <div className='max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md'>
        <h2 className='mb-5 text-2xl font-semibold text-gray-700'>
        CurrencyConverter
        </h2>
        {/* Dropdown section */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
            <CurrencyDropdown currencies={currencies} 
             title='From'
             favorites={favorites}
             currency={fromCurrency}
             setCurrency={setfromCurrency}
             handleFavorite={handleFavorite}/>
            {/* Swap currency button */}
            <div className='flex justify-center -mb-5 sm:mb-0'>
                <button onClick={swapCurrencies} className='p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300'>
                    <HiArrowsRightLeft className='text-gray-700' />
                </button>
            </div>
            <CurrencyDropdown currencies={currencies} 
            title='To' 
            favorites={favorites}
            currency={toCurrency}
            setCurrency={settoCurrency}
            handleFavorite={handleFavorite}/>
        </div>

        {/* Input section  */}
        <div className='mt-4'>
            <label htmlFor="amount"
            className='block text-sm font-medium text-gray-700'>Amount</label>
            <input  type="number" 
            // value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            className='mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
        </div>
        <div className='flex justify-end mt-6'>
            <button onClick={convertCurrency} 
            className={`x-5 px-2 py-2 bg-indigo-600 font-normal text-white rounded-md hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
            ${converting?"animate-pulse":""}`}>Convert</button> 
        </div>

        {/* Result section */}
        {convertedAmount&& (
            <div className='mt-4 text-lg font-medium text-right text-green-600'>
            Converted Amount: {convertedAmount}
        </div>
        )}
    </div>
  )
}

export default CurrencyConverter