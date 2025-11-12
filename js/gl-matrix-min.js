/**
 * gl-matrix 3.4.0 - Minimal version for this project
 * Only includes vec3 and mat4 modules
 */
(function(global) {
    'use strict';
    
    const EPSILON = 0.000001;
    
    // vec3 module
    const vec3 = {
        create: function() {
            const out = new Float32Array(3);
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            return out;
        },
        
        fromValues: function(x, y, z) {
            const out = new Float32Array(3);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        },
        
        normalize: function(out, a) {
            const x = a[0];
            const y = a[1];
            const z = a[2];
            let len = x * x + y * y + z * z;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
            }
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
            return out;
        },
        
        cross: function(out, a, b) {
            const ax = a[0], ay = a[1], az = a[2];
            const bx = b[0], by = b[1], bz = b[2];
            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        },
        
        subtract: function(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            return out;
        }
    };
    
    // mat4 module
    const mat4 = {
        create: function() {
            const out = new Float32Array(16);
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        },
        
        perspective: function(out, fovy, aspect, near, far) {
            const f = 1.0 / Math.tan(fovy / 2);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[15] = 0;
            
            if (far != null && far !== Infinity) {
                const nf = 1 / (near - far);
                out[10] = (far + near) * nf;
                out[14] = 2 * far * near * nf;
            } else {
                out[10] = -1;
                out[14] = -2 * near;
            }
            return out;
        },
        
        lookAt: function(out, eye, center, up) {
            let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
            const eyex = eye[0];
            const eyey = eye[1];
            const eyez = eye[2];
            const upx = up[0];
            const upy = up[1];
            const upz = up[2];
            const centerx = center[0];
            const centery = center[1];
            const centerz = center[2];
            
            if (Math.abs(eyex - centerx) < EPSILON &&
                Math.abs(eyey - centery) < EPSILON &&
                Math.abs(eyez - centerz) < EPSILON) {
                return mat4.identity(out);
            }
            
            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;
            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;
            
            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }
            
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;
            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }
            
            out[0] = x0;
            out[1] = y0;
            out[2] = z0;
            out[3] = 0;
            out[4] = x1;
            out[5] = y1;
            out[6] = z1;
            out[7] = 0;
            out[8] = x2;
            out[9] = y2;
            out[10] = z2;
            out[11] = 0;
            out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
            out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
            out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
            out[15] = 1;
            
            return out;
        },
        
        identity: function(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        },
        
        rotateX: function(out, a, rad) {
            const s = Math.sin(rad);
            const c = Math.cos(rad);
            const a10 = a[4];
            const a11 = a[5];
            const a12 = a[6];
            const a13 = a[7];
            const a20 = a[8];
            const a21 = a[9];
            const a22 = a[10];
            const a23 = a[11];
            
            if (a !== out) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            return out;
        },
        
        rotateY: function(out, a, rad) {
            const s = Math.sin(rad);
            const c = Math.cos(rad);
            const a00 = a[0];
            const a01 = a[1];
            const a02 = a[2];
            const a03 = a[3];
            const a20 = a[8];
            const a21 = a[9];
            const a22 = a[10];
            const a23 = a[11];
            
            if (a !== out) {
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            return out;
        },
        
        scale: function(out, a, v) {
            const x = v[0], y = v[1], z = v[2];
            out[0] = a[0] * x;
            out[1] = a[1] * x;
            out[2] = a[2] * x;
            out[3] = a[3] * x;
            out[4] = a[4] * y;
            out[5] = a[5] * y;
            out[6] = a[6] * y;
            out[7] = a[7] * y;
            out[8] = a[8] * z;
            out[9] = a[9] * z;
            out[10] = a[10] * z;
            out[11] = a[11] * z;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
    };
    
    // Export to global
    global.vec3 = vec3;
    global.mat4 = mat4;
    
})(typeof window !== 'undefined' ? window : global);
