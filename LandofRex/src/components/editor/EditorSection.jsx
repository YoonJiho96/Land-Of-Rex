import React from 'react';
import MyEditor from './MyEditor-tiny'

const EditorSection = React.forwardRef((props, ref) => (

<section ref={ref} className="editor-section">
    <MyEditor/>
</section>

));

export default EditorSection;