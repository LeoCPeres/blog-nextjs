import React, { useRef } from 'react';

import useScript from '../../hooks/useScript';

const Comment = () => {
  const comment = useRef(null);

  const status = useScript({
    url: 'https://utteranc.es/client.js',
    repo: 'LeoCPeres/blog-nextjs',
    issueTerm: 'pathname',
    theme: 'github-dark',
    ref: comment,
  });

  return <div className="w-full">{<div ref={comment}></div>}</div>;
};

export default Comment;
