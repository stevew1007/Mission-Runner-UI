import Body from "../../components/Body";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
// import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import rehypeRaw from 'rehype-raw'
import content from "../../assets/intro.md";

const Dashboard = () => {
    const [md, setMD] = useState("");

    useEffect(() => {
        fetch(content)
            .then((response) => response.text())
            .then((text) => setMD(text));
    },[]);
    // console.log(md)
    return (
        <Body
            topbar={true}
            title="使用说明"
            subtitle="麻烦先把说明看了再开始刷"
        >
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {md}
            </ReactMarkdown>
          
        </Body>
    );
};

export default Dashboard;
