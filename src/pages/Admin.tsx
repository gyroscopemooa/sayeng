import { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const Admin = () => {
  const [form, setForm] = useState({
    object: '',
    color: '',
    askMode: 'object',
    prompt_ko: '',
    prompt_en: '',
    answers_en: '', // comma separated
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setLoading(true);
    try {
        // Upload Image
        const storageRef = ref(storage, `cards/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(storageRef);

        // Create Doc
        await addDoc(collection(db, 'cards'), {
            imageUrl,
            object: form.object,
            color: form.color,
            askMode: form.askMode,
            prompt_ko: form.prompt_ko,
            prompt_en: form.prompt_en,
            answers_en: form.answers_en.split(',').map(s => s.trim()),
            createdAt: serverTimestamp()
        });
        
        alert("Card added!");
        setForm({
            object: '',
            color: '',
            askMode: 'object',
            prompt_ko: '',
            prompt_en: '',
            answers_en: '',
        });
        setImage(null);
    } catch(e) {
        console.error(e);
        alert("Error adding card");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="admin-container">
        <h1 className="home-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Add New Card</h1>
        <form onSubmit={handleSubmit} className="flex-col gap-4">
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
            
            <input 
                placeholder="Object Name (e.g. Apple)" 
                value={form.object} 
                onChange={e => setForm({...form, object: e.target.value})}
                className="form-input"
                required
            />
            <input 
                placeholder="Color (e.g. Red)" 
                value={form.color} 
                onChange={e => setForm({...form, color: e.target.value})}
                className="form-input"
            />
            
            <select 
                value={form.askMode}
                onChange={e => setForm({...form, askMode: e.target.value})}
                className="form-input"
            >
                <option value="object">Ask Object</option>
                <option value="color_object">Ask Color + Object</option>
            </select>

            <input 
                placeholder="Prompt (KR)" 
                value={form.prompt_ko} 
                onChange={e => setForm({...form, prompt_ko: e.target.value})}
                className="form-input"
                required
            />
            <input 
                placeholder="Prompt (EN)" 
                value={form.prompt_en} 
                onChange={e => setForm({...form, prompt_en: e.target.value})}
                className="form-input"
                required
            />
            <input 
                placeholder="Answers (comma separated, e.g. apple, an apple)" 
                value={form.answers_en} 
                onChange={e => setForm({...form, answers_en: e.target.value})}
                className="form-input"
                required
            />

            <button disabled={loading} className="btn btn-primary btn-md">
                {loading ? "Uploading..." : "Add Card"}
            </button>
        </form>
    </div>
  );
};
