uniform sampler2D uTextures;

varying vec2 vUv;

void main()
{
    vec4 texture = texture2D(uTextures,vUv);
    
    gl_FragColor = texture;
}
 