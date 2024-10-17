import { useEffect, useState } from "react";
export default function Info() {
  // const [message, setMessage] = useState("");
  // useEffect(() => {
  //   //fetchでバックエンドExpressのサーバーを指定
  //   fetch("/info")
  //     //レスポンスをjsonとして受け取りjsオブジェクトを生成
  //     .then((res) => res.json())
  //     //生成したjsオブジェクトをdataに代入
  //     //data.messageで取り出したデータをuseStateに保存
  //     .then((data) => setMessage(data.message));
  // }, []);

  // return <p>{message}</p>;
  return <p>お知らせはありません。</p>;
}
