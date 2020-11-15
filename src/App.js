import React from 'react';
import logo from './logo.svg';
import './App.css';
import searchImg from'./assets/seach.svg';
import CardItem from './component/CardItem';
import moment from 'moment';

const baseUrl = 'https://api.thecatapi.com';
const urlList = {
  breedList: `${baseUrl}/v1/breeds`,
  imageSearch: `${baseUrl}/v1/images/search`
}

function App() {

  const baseUrl = 'https://api.thecatapi.com/';

  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [dataList, setDataList] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [isLoading, setLoading] = React.useState(true);

  const handleChange = ({ target: { value } }) => {
    setSearchInput(value)
  }

  const handleSearch = (e) => {

    if(!searchInput) {
      handleGetData();
    } 
    e.preventDefault();
    setDataList([])
    handleGetData(false,true);
  }

  const handleGetData = (isLoadMore = false, isSearch = false) => {
    setLoading(true)

    const request = isSearch ? fetch(`${urlList.breedList}/search?q=${searchInput}&page=${page}&limit=${limit}`) : fetch(`${urlList.breedList}?page=${page}&limit=${limit}`) 

    request
      .then(res => {
        return res.json()
      })
      .then(async result => {
        if(result) {
          
          const dataWithImage = result.map(breed => {
            return fetch(`${urlList.imageSearch}?breed_id=${breed.id}`)
                    .then(res => res.json())
                    .then(resultImage => {
                      if(resultImage && resultImage.length > 0 && resultImage[0] && resultImage[0].url) {
                        return {
                          ...breed,
                          image: resultImage[0].url
                        }
                      }

                      return breed;
                    })
          })

          const resultData = await Promise.all(dataWithImage);


          if(isLoadMore) {
            setDataList([...dataList, ...resultData])
          } else {
            setDataList(resultData)
          }
        }

        setLoading(false)
      }).catch(err => {
        console.log('err', err)
      })
  }
  
  const handleNextPage = () => {
    handleGetData(true)
    setPage(page + 1);
  }

  const handleInitiate = React.useCallback(() => {
    handleGetData();
  }, [])

  React.useEffect(() => {
    if(searchInput && searchInput.length >= 3) {

    }
  }, [searchInput])


  React.useEffect(() => {
    handleInitiate();
  }, [])


  console.log('dataList', dataList)

  return (
    <div className="container">
      <div className="title">Daftar Kucing</div>
      <div>
        <form onSubmit={handleSearch} className="input-search">
          <img className="input-search-img" src={searchImg}></img>
          <input onChange={handleChange} value={searchInput} className="input-search-field" type="text" placeholder="Cari Kucing"></input>
        </form>
        <div className="data-list">
          {dataList.map(data => {
            return (
              <CardItem data={data} image={data.image} name={data.name} origin={data.origin}/>
            )
          })}
        </div>

        <div className="button-loadmore-wrapper">
          {isLoading ? <button>Sedang Memuat...</button> : <button onClick={handleNextPage}>Lihat berikutnya</button>}
        </div>
      </div>
    </div>
  );
}

export default App;
 