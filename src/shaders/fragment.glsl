uniform sampler2D uTextures;
uniform sampler2D uPrevTextures;
uniform float uAlpha;

varying vec2 vUv;

void main()
{
    // Sample both textures
    vec4 prevTexture = texture(uPrevTextures,vUv);
    vec4 newTexture = texture(uTextures,vUv);

    // Blend the textures using mix function
    vec4 mixed = mix(prevTexture,newTexture,uAlpha);
    
    gl_FragColor = mixed;
}
 