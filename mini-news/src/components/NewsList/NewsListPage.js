import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import SearchPage from "../Search/SearchPage";
import Header from "../Header/Header";
import Styled, { css } from "styled-components";
import { NewsWrap } from "../../styles/WrapStyle";
import ClipPage from "../Clip/ClipPage";
import API_KEY from "./Token.js";
import bookmark_before from "../../img/bookmark_before.png";
import bookmark_after from "../../img/bookmark_after.png";

//뉴스기사 검색 받은걸 보여주는 기능 구현
export default function NewsListPage() {
  const [articles, setArticles] = useState([]);
  const [term, setTerm] = useState("everything"); //모든기사
  const [isLodading, setIsLodading] = useState(true); //화면에 데이터를 표시하지않을떄마다 로딩을 표시(기본적사실)  api에서 데이터를 가져오면 로딩애니매시연을 제거

  //loading 즉시 사용효과 설정, 양식을 검색하기위해 용어 설정
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${term}&api-key=${API_KEY}`
        );
        const articles = await res.json();
        console.log(articles.response.docs);
        setArticles(articles.response.docs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <>
      <SearchPage />
      <NewsWrap>
        <ClipPage />
        {articles.map((article) => {
          const {
            headline:{main},
            pub_date,
            _id,
            byline: { original },
            web_url,
          } = article;
          let sliceByline;
          if (typeof original === "string") {sliceByline = original.substr(-(original.length - 3));}
          return (
            <NewsList key={_id}>
              <NewsTitle>
                <h3>{main}</h3>
                <a href={web_url} target="_blank" rel="noreferrer">
                  <button>DETAIL &gt;</button>
                </a>
              </NewsTitle>
              <NewsInfo>
                <p>{sliceByline}</p>
                <p>{pub_date}</p>
              </NewsInfo>
              <ClipBtn />
            </NewsList>
          );
        })}
      </NewsWrap>
    </>
  );
}

const NewsList = Styled.div`
  position: relative;
  padding: 16px 16px 20px 50px;
  background: rgb(255, 255, 255);
  overflow: hidden;
  margin: 0px auto 12px;
  box-shadow: rgb(0 0 0 / 8%) 0px 2px 12px;
  border-radius: 16px;
`;

const ClipBtn = Styled.button`
  position: absolute;
  top: 42px;
  left: 15px;
  width: 20px;
  height: 30px;
  border: 0;
  background: url(${bookmark_before}) no-repeat;
  background-size: contain;
  background-position: center;
  transition: all 0.2s linear;
  cursor: pointer;
`;

const NewsTitle = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 14px;
  > a button{
    width: 80px;
    padding: 2px 0;
    background: #f2f2f6;
    border: 0;
    border-radius: 20px;
    color: #999;
    font-family: 'Roboto', 'NanumSquareRound', sans-serif;
    font-size: .8rem;
    cursor: pointer;
  }
`;
const NewsInfo = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 0;
  border-top: 1px solid rgb(240, 240, 246);
  > span{
    width: 78px;
    height: 12px;
    overflow: hidden;
    word-break: break-all;
    color: rgb(118, 118, 118);
    font-size: .8rem;
  }
`;
