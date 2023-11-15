import React, { useEffect } from 'react';
import { Button, Layout, Typography, Input, Space } from 'antd';
import { Helmet } from 'react-helmet';

const Avatar: React.FC = () => {
  useEffect(() => {
    // Se precisar de código de inicialização, você pode colocá-lo aqui
  }, []);

  return (
    <Layout>
      <Helmet>
        <script src="./script" type="module" />
        
      </Helmet>
      <div className="preview">
        <video className="input_video" width="1280px" height="720px"></video>
        <canvas className="guides"></canvas>
      </div>
      <nav></nav>
    </Layout>
  );
};

export default Avatar;
