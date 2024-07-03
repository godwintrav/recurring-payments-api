import { sanitize } from "../sanitize"

describe('sanitize', () => {
    it('should replace strings containing HTML special characters', () => {
        expect(sanitize("<script>alert('xss')</script>")).toEqual("&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;");
    });

    it('should return same strings  if not containing HTML special characters', () => {
        const data = 'test-data'
        expect(sanitize(data)).toEqual(data);
    });
})