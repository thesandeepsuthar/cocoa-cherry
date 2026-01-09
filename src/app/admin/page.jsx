'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Tabs
const TABS = [
  { id: 'gallery', label: 'Gallery', icon: 'photo_library' },
  { id: 'reels', label: 'Reels', icon: 'movie' },
  { id: 'menu', label: 'Menu', icon: 'restaurant_menu' },
  { id: 'ratelist', label: 'Rates', icon: 'payments' },
  { id: 'reviews', label: 'Reviews', icon: 'rate_review' },
];

// Form Error Component
function FormError({ error }) {
  if (!error) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-400 text-xs mt-1"
    >
      {error}
    </motion.p>
  );
}

// Image Upload Component
function ImageUpload({ value, onChange, label, error, required }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-cream mb-1.5 sm:mb-2">
        {label} {required && <span className="text-rose">*</span>}
      </label>
      <div className={`border-2 border-dashed rounded-xl p-3 sm:p-4 text-center transition-colors ${error ? 'border-red-400' : 'border-cream/20 hover:border-rose/50'}`}>
        {value ? (
          <div className="relative">
            <Image
              src={value}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto rounded-lg object-cover max-h-36 sm:max-h-48"
              unoptimized
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ) : (
          <label className="cursor-pointer block py-6 sm:py-8">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-rose mb-2">cloud_upload</span>
            <p className="text-rose text-xs sm:text-sm">Tap to upload image</p>
            <p className="text-cream/40 text-xs mt-1">Max: 5MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <FormError error={error} />
    </div>
  );
}

// Input Field Component
function InputField({ label, type = 'text', value, onChange, placeholder, required, error, min, max, step }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-cream mb-1">
        {label} {required && <span className="text-rose">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`w-full h-10 sm:h-11 rounded-lg border px-3 text-sm focus:ring-2 focus:ring-rose/20 
                   bg-noir-light text-cream placeholder:text-cream/40 
                   ${error ? 'border-red-400' : 'border-cream/10 focus:border-rose'}`}
      />
      <FormError error={error} />
    </div>
  );
}

// Gallery Tab
function GalleryTab({ adminKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ imageData: '', caption: '', alt: '', order: 0 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.imageData) newErrors.imageData = 'Image is required';
    if (!formData.caption?.trim()) newErrors.caption = 'Caption is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const url = editingItem ? `/api/gallery/${editingItem._id}?key=${adminKey}` : `/api/gallery?key=${adminKey}`;
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchItems();
        closeForm();
      } else alert(data.error);
    } catch (error) {
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}?key=${adminKey}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ imageData: item.imageData, caption: item.caption, alt: item.alt, order: item.order });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ imageData: '', caption: '', alt: '', order: 0 });
    setErrors({});
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>Gallery ({items.length})</h2>
        <button onClick={() => { closeForm(); setShowForm(true); }} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 
                         text-sm font-medium shadow-md bg-gradient-to-r from-rose to-rose-dark text-noir">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Image
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <FormModal title={editingItem ? 'Edit Image' : 'Add Image'} onClose={closeForm}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload value={formData.imageData} onChange={(v) => { setFormData({ ...formData, imageData: v }); setErrors({ ...errors, imageData: '' }); }} label="Image" error={errors.imageData} required />
              <InputField label="Caption" value={formData.caption} onChange={(e) => { setFormData({ ...formData, caption: e.target.value }); setErrors({ ...errors, caption: '' }); }} placeholder="Wedding Cake" required error={errors.caption} />
              <InputField label="Alt Text" value={formData.alt} onChange={(e) => setFormData({ ...formData, alt: e.target.value })} placeholder="Description for accessibility" />
              <InputField label="Order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} min="0" />
              <FormButtons onCancel={closeForm} submitting={submitting} submitText={editingItem ? 'Update' : 'Add'} />
            </form>
          </FormModal>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <ItemCard key={item._id} image={item.imageData} title={item.caption} subtitle={`Order: ${item.order}`} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item._id)} aspectRatio="square" />
        ))}
      </div>

      {items.length === 0 && <EmptyState icon="photo_library" text="No gallery images yet" />}
    </div>
  );
}

// Reels Tab
function ReelsTab({ adminKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ videoUrl: '', thumbnailData: '', caption: '', order: 0 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/reels');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.videoUrl?.trim()) newErrors.videoUrl = 'Video URL is required';
    else if (!/^https?:\/\/.+/.test(formData.videoUrl)) newErrors.videoUrl = 'Enter a valid URL';
    if (!formData.thumbnailData) newErrors.thumbnailData = 'Thumbnail is required';
    if (!formData.caption?.trim()) newErrors.caption = 'Caption is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const url = editingItem ? `/api/reels/${editingItem._id}?key=${adminKey}` : `/api/reels?key=${adminKey}`;
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchItems();
        closeForm();
      } else alert(data.error);
    } catch (error) {
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this reel?')) return;
    try {
      const res = await fetch(`/api/reels/${id}?key=${adminKey}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ videoUrl: item.videoUrl, thumbnailData: item.thumbnailData, caption: item.caption, order: item.order });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ videoUrl: '', thumbnailData: '', caption: '', order: 0 });
    setErrors({});
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>Reels ({items.length})</h2>
        <button onClick={() => { closeForm(); setShowForm(true); }} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 
                         text-sm font-medium shadow-md bg-gradient-to-r from-rose to-rose-dark text-noir">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Reel
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <FormModal title={editingItem ? 'Edit Reel' : 'Add Reel'} onClose={closeForm}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Video URL" type="url" value={formData.videoUrl} onChange={(e) => { setFormData({ ...formData, videoUrl: e.target.value }); setErrors({ ...errors, videoUrl: '' }); }} placeholder="https://instagram.com/reel/..." required error={errors.videoUrl} />
              <ImageUpload value={formData.thumbnailData} onChange={(v) => { setFormData({ ...formData, thumbnailData: v }); setErrors({ ...errors, thumbnailData: '' }); }} label="Thumbnail" error={errors.thumbnailData} required />
              <InputField label="Caption" value={formData.caption} onChange={(e) => { setFormData({ ...formData, caption: e.target.value }); setErrors({ ...errors, caption: '' }); }} placeholder="Frosting magic ✨" required error={errors.caption} />
              <InputField label="Order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} min="0" />
              <FormButtons onCancel={closeForm} submitting={submitting} submitText={editingItem ? 'Update' : 'Add'} />
            </form>
          </FormModal>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <div key={item._id} className="card-noir rounded-xl overflow-hidden">
            <div className="relative aspect-[9/16]">
              <Image src={item.thumbnailData} alt={item.caption} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-noir/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-cream text-3xl sm:text-4xl">play_circle</span>
              </div>
            </div>
            <div className="p-2.5 sm:p-3">
              <p className="text-xs sm:text-sm font-medium text-cream truncate">{item.caption}</p>
              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-rose hover:underline truncate block mb-2 sm:mb-3">
                View Video →
              </a>
              <ActionButtons onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item._id)} />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && <EmptyState icon="movie" text="No reels yet" />}
    </div>
  );
}

// Menu Tab
function MenuTab({ adminKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', imageData: '', badge: '', price: '', discountPrice: '', priceUnit: 'per kg', order: 0 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.imageData) newErrors.imageData = 'Image is required';
    if (formData.price && isNaN(parseFloat(formData.price))) newErrors.price = 'Invalid price';
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) newErrors.discountPrice = 'Must be less than original';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const url = editingItem ? `/api/menu/${editingItem._id}?key=${adminKey}` : `/api/menu?key=${adminKey}`;
      const dataToSend = { ...formData, price: formData.price ? parseFloat(formData.price) : 0, discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null };
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (data.success) {
        fetchItems();
        closeForm();
      } else alert(data.error);
    } catch (error) {
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/menu/${id}?key=${adminKey}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, imageData: item.imageData, badge: item.badge || '', price: item.price?.toString() || '', discountPrice: item.discountPrice?.toString() || '', priceUnit: item.priceUnit || 'per kg', order: item.order });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', imageData: '', badge: '', price: '', discountPrice: '', priceUnit: 'per kg', order: 0 });
    setErrors({});
  };

  const getDiscountPercentage = () => {
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discountPrice);
    if (price && discount && discount < price) return Math.round(((price - discount) / price) * 100);
    return 0;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>Menu ({items.length})</h2>
        <button onClick={() => { closeForm(); setShowForm(true); }} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 
                         text-sm font-medium shadow-md bg-gradient-to-r from-rose to-rose-dark text-noir">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Item
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <FormModal title={editingItem ? 'Edit Item' : 'Add Item'} onClose={closeForm} wide>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }} placeholder="Belgian Truffle" required error={errors.name} />
              <div>
                <label className="block text-xs sm:text-sm font-bold text-cream mb-1">Description <span className="text-rose">*</span></label>
                <textarea value={formData.description} onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setErrors({ ...errors, description: '' }); }} 
                          className={`w-full rounded-lg border px-3 py-2 resize-none text-sm bg-noir-light text-cream placeholder:text-cream/40 
                                    ${errors.description ? 'border-red-400' : 'border-cream/10 focus:border-rose'}`} 
                          rows={3} placeholder="Rich chocolate cake..." />
                <FormError error={errors.description} />
              </div>
              <ImageUpload value={formData.imageData} onChange={(v) => { setFormData({ ...formData, imageData: v }); setErrors({ ...errors, imageData: '' }); }} label="Image" error={errors.imageData} required />
              
              {/* Pricing Section */}
              <div className="bg-noir-light rounded-xl p-3 sm:p-4 space-y-3 border border-cream/10">
                <h4 className="font-bold text-cream text-xs sm:text-sm">💰 Pricing</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InputField label="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="850" min="0" error={errors.price} />
                  <InputField label="Discount (₹)" type="number" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} placeholder="Optional" min="0" error={errors.discountPrice} />
                </div>
                {getDiscountPercentage() > 0 && (
                  <div className="flex items-center gap-2 bg-green-900/30 p-2 rounded-lg text-xs sm:text-sm border border-green-500/20">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">{getDiscountPercentage()}% OFF</span>
                    <span className="line-through text-cream/40">₹{formData.price}</span>
                    <span className="text-green-400 font-bold">₹{formData.discountPrice}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-cream mb-1">Unit</label>
                  <select value={formData.priceUnit} onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })} 
                          className="w-full h-10 rounded-lg border border-cream/10 px-3 text-sm bg-noir-light text-cream">
                    <option value="per kg">Per Kg</option>
                    <option value="per piece">Per Piece</option>
                    <option value="per box">Per Box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-cream mb-1">Badge</label>
                  <select value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} 
                          className="w-full h-10 rounded-lg border border-cream/10 px-3 text-sm bg-noir-light text-cream">
                    <option value="">None</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New">New</option>
                    <option value="Popular">Popular</option>
                  </select>
                </div>
                <InputField label="Order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} min="0" />
              </div>
              <FormButtons onCancel={closeForm} submitting={submitting} submitText={editingItem ? 'Update' : 'Add'} />
            </form>
          </FormModal>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item) => {
          const hasDiscount = item.discountPrice && item.discountPrice < item.price;
          const discountPercent = hasDiscount ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;
          
          return (
            <div key={item._id} className="card-noir rounded-xl overflow-hidden">
              <div className="relative h-32 sm:h-40">
                <Image src={item.imageData} alt={item.name} fill className="object-cover" unoptimized />
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                  {item.badge && <span className="bg-rose text-noir text-xs px-2 py-0.5 rounded font-bold">{item.badge}</span>}
                  {hasDiscount && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-bold">{discountPercent}% OFF</span>}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-cream text-sm sm:text-base mb-1">{item.name}</h3>
                <p className="text-xs sm:text-sm text-cream-muted line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center gap-2 mb-3 text-sm">
                  {hasDiscount ? (
                    <>
                      <span className="text-rose font-bold">₹{item.discountPrice}</span>
                      <span className="text-cream/40 line-through text-xs">₹{item.price}</span>
                    </>
                  ) : item.price ? (
                    <span className="text-rose font-bold">₹{item.price}</span>
                  ) : null}
                  {item.priceUnit && <span className="text-xs text-cream-muted">/{item.priceUnit.replace('per ', '')}</span>}
                </div>
                <ActionButtons onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item._id)} />
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && <EmptyState icon="restaurant_menu" text="No menu items yet" />}
    </div>
  );
}

// Rate List Tab
function RateListTab({ adminKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ 
    category: '', 
    item: '', 
    description: '', 
    price: '', 
    discountPrice: '', 
    unit: 'per kg', 
    isAvailable: true,
    order: 0 
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/ratelist?key=${adminKey}`);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Get unique categories
  const categories = ['all', ...new Set(items.map((item) => item.category))];

  // Filter items by category
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter((item) => item.category === activeCategory);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.item?.trim()) newErrors.item = 'Item name is required';
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) newErrors.price = 'Valid price is required';
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.price)) newErrors.discountPrice = 'Must be less than original price';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const url = editingItem ? `/api/ratelist/${editingItem._id}?key=${adminKey}` : `/api/ratelist?key=${adminKey}`;
      const dataToSend = { 
        ...formData, 
        price: parseFloat(formData.price), 
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null 
      };
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (data.success) {
        fetchItems();
        closeForm();
      } else alert(data.error);
    } catch (error) {
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this rate item?')) return;
    try {
      const res = await fetch(`/api/ratelist/${id}?key=${adminKey}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ 
      category: item.category, 
      item: item.item, 
      description: item.description || '', 
      price: item.price?.toString() || '', 
      discountPrice: item.discountPrice?.toString() || '', 
      unit: item.unit || 'per kg', 
      isAvailable: item.isAvailable !== false,
      order: item.order || 0 
    });
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ category: '', item: '', description: '', price: '', discountPrice: '', unit: 'per kg', isAvailable: true, order: 0 });
    setErrors({});
  };

  const getDiscountPercentage = () => {
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discountPrice);
    if (price && discount && discount < price) return Math.round(((price - discount) / price) * 100);
    return 0;
  };

  // Predefined categories
  const predefinedCategories = ['Cakes', 'Pastries', 'Cupcakes', 'Cookies', 'Brownies', 'Chocolates', 'Breads', 'Desserts', 'Beverages', 'Special Items'];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>Rate List ({items.length})</h2>
        <button onClick={() => { closeForm(); setShowForm(true); }} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 
                         text-sm font-medium shadow-md bg-gradient-to-r from-rose to-rose-dark text-noir">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Item
        </button>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium capitalize whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-rose to-rose-dark text-noir' 
                  : 'bg-noir-light text-cream border border-cream/10 hover:border-rose/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <FormModal title={editingItem ? 'Edit Rate Item' : 'Add Rate Item'} onClose={closeForm} wide>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-cream mb-1">
                  Category <span className="text-rose">*</span>
                </label>
                <div className="flex gap-2">
                  <select 
                    value={predefinedCategories.includes(formData.category) ? formData.category : 'custom'} 
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setFormData({ ...formData, category: e.target.value });
                        setErrors({ ...errors, category: '' });
                      }
                    }} 
                    className="flex-1 h-10 rounded-lg border border-cream/10 px-3 text-sm bg-noir-light text-cream"
                  >
                    <option value="">Select category</option>
                    {predefinedCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">Custom...</option>
                  </select>
                </div>
                {(!predefinedCategories.includes(formData.category) || formData.category === '') && (
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => { setFormData({ ...formData, category: e.target.value }); setErrors({ ...errors, category: '' }); }}
                    placeholder="Enter custom category"
                    className={`w-full h-10 rounded-lg border px-3 text-sm mt-2 bg-noir-light text-cream placeholder:text-cream/40 ${errors.category ? 'border-red-400' : 'border-cream/10'}`}
                  />
                )}
                <FormError error={errors.category} />
              </div>

              <InputField label="Item Name" value={formData.item} onChange={(e) => { setFormData({ ...formData, item: e.target.value }); setErrors({ ...errors, item: '' }); }} placeholder="Chocolate Truffle Cake" required error={errors.item} />
              
              <div>
                <label className="block text-xs sm:text-sm font-bold text-cream mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                          className="w-full rounded-lg border border-cream/10 px-3 py-2 resize-none text-sm bg-noir-light text-cream placeholder:text-cream/40" 
                          rows={2} placeholder="Rich chocolate layers with truffle frosting..." />
              </div>

              {/* Pricing Section */}
              <div className="bg-noir-light rounded-xl p-3 sm:p-4 space-y-3 border border-cream/10">
                <h4 className="font-bold text-cream text-xs sm:text-sm">💰 Pricing</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InputField label="Price (₹)" type="number" value={formData.price} onChange={(e) => { setFormData({ ...formData, price: e.target.value }); setErrors({ ...errors, price: '' }); }} placeholder="500" min="0" required error={errors.price} />
                  <InputField label="Discount Price (₹)" type="number" value={formData.discountPrice} onChange={(e) => { setFormData({ ...formData, discountPrice: e.target.value }); setErrors({ ...errors, discountPrice: '' }); }} placeholder="Optional" min="0" error={errors.discountPrice} />
                </div>
                {getDiscountPercentage() > 0 && (
                  <div className="flex items-center gap-2 bg-green-900/30 p-2 rounded-lg text-xs sm:text-sm border border-green-500/20">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">{getDiscountPercentage()}% OFF</span>
                    <span className="line-through text-cream/40">₹{formData.price}</span>
                    <span className="text-green-400 font-bold">₹{formData.discountPrice}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-cream mb-1">Unit</label>
                  <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} 
                          className="w-full h-10 rounded-lg border border-cream/10 px-3 text-sm bg-noir-light text-cream">
                    <option value="per kg">Per Kg</option>
                    <option value="per piece">Per Piece</option>
                    <option value="per box">Per Box</option>
                    <option value="per dozen">Per Dozen</option>
                    <option value="per set">Per Set</option>
                    <option value="per serving">Per Serving</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-cream mb-1">Availability</label>
                  <select value={formData.isAvailable ? 'yes' : 'no'} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'yes' })} 
                          className="w-full h-10 rounded-lg border border-cream/10 px-3 text-sm bg-noir-light text-cream">
                    <option value="yes">Available</option>
                    <option value="no">Not Available</option>
                  </select>
                </div>
                <InputField label="Order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} min="0" />
              </div>
              
              <FormButtons onCancel={closeForm} submitting={submitting} submitText={editingItem ? 'Update' : 'Add'} />
            </form>
          </FormModal>
        )}
      </AnimatePresence>

      {/* Rate List Table - Desktop */}
      <div className="hidden md:block card-noir rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-noir-light">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-cream">Category</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-cream">Item</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-cream">Description</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-cream">Unit</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-cream">Price</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-cream">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/10">
            {filteredItems.map((item, index) => {
              const hasDiscount = item.discountPrice && item.discountPrice < item.price;
              const discountPercent = hasDiscount ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;

              return (
                <tr key={item._id} className={`hover:bg-cream/5 transition-colors ${index % 2 === 0 ? 'bg-noir' : 'bg-noir-light/30'}`}>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose/10 text-rose border border-rose/20">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-cream text-sm">{item.item}</span>
                      {hasDiscount && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-bold border border-green-500/20">{discountPercent}% OFF</span>
                      )}
                      {!item.isAvailable && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-cream/10 text-cream/50 border border-cream/20">Unavailable</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-cream-muted max-w-[200px] truncate">{item.description || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-cream-muted">{item.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {hasDiscount ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-cream/40 line-through text-xs">₹{item.price}</span>
                        <span className="font-bold text-rose">₹{item.discountPrice}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-cream">₹{item.price}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg bg-cream/10 text-cream hover:bg-rose hover:text-noir transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-cream-muted">
            <span className="material-symbols-outlined text-4xl mb-2">payments</span>
            <p>No items in this category</p>
          </div>
        )}
      </div>

      {/* Rate List Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredItems.map((item) => {
          const hasDiscount = item.discountPrice && item.discountPrice < item.price;
          const discountPercent = hasDiscount ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;

          return (
            <div key={item._id} className={`card-noir rounded-xl p-3 ${!item.isAvailable ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose/10 text-rose border border-rose/20 mb-1.5">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-cream text-sm">{item.item}</h4>
                    {hasDiscount && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 font-bold">{discountPercent}% OFF</span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-cream-muted mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <div className="text-right ml-3">
                  {hasDiscount ? (
                    <div className="flex flex-col items-end">
                      <span className="text-cream/40 line-through text-xs">₹{item.price}</span>
                      <span className="font-bold text-rose text-lg">₹{item.discountPrice}</span>
                    </div>
                  ) : (
                    <span className="font-bold text-cream text-lg">₹{item.price}</span>
                  )}
                  <span className="text-xs text-cream-muted block">{item.unit}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-cream/10">
                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-cream/10 text-cream rounded-lg hover:bg-rose hover:text-noir transition-colors text-xs font-medium">
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-xs font-medium">
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && <EmptyState icon="payments" text="No rate list items yet" />}
    </div>
  );
}

// Reviews Tab
function ReviewsTab({ adminKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?key=${adminKey}`);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAction = async (id, action, value) => {
    try {
      const res = await fetch(`/api/reviews/${id}?key=${adminKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [action]: value }),
      });
      if ((await res.json()).success) fetchItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}?key=${adminKey}`, { method: 'DELETE' });
      if ((await res.json()).success) fetchItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.isApproved;
    if (filter === 'approved') return item.isApproved;
    return true;
  });

  const pendingCount = items.filter((item) => !item.isApproved).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>Reviews ({items.length})</h2>
          {pendingCount > 0 && (
            <p className="text-xs sm:text-sm text-orange-400 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {pendingCount} pending
            </p>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'pending', 'approved'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} 
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium capitalize whitespace-nowrap transition-all ${
                      filter === f 
                        ? 'bg-gradient-to-r from-rose to-rose-dark text-noir' 
                        : 'bg-noir-light text-cream border border-cream/10'
                    }`}>
              {f} {f === 'pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredItems.map((item) => (
          <div key={item._id} className={`card-noir rounded-xl p-3 sm:p-4 ${!item.isApproved ? 'border-l-4 border-orange-400' : ''} ${item.isFeatured ? 'ring-2 ring-rose' : ''}`}>
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-cream text-sm sm:text-base">{item.name}</h3>
                    {item.isFeatured && <span className="text-xs bg-rose text-noir px-1.5 py-0.5 rounded font-bold">Featured</span>}
                    {!item.isApproved && <span className="text-xs bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">Pending</span>}
                  </div>
                  <p className="text-xs text-cream-muted truncate">{item.email}</p>
                </div>
                <div className="flex gap-0.5 text-gold flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: i < item.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                  ))}
                </div>
              </div>
              
              {/* Review Text */}
              <p className="text-xs sm:text-sm text-cream-muted italic">&ldquo;{item.review}&rdquo;</p>
              <p className="text-xs text-cream/40">{item.cakeType || 'General'} • {new Date(item.createdAt).toLocaleDateString()}</p>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleAction(item._id, 'isApproved', !item.isApproved)} 
                        className={`flex-1 min-w-[100px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                          item.isApproved ? 'bg-green-900/30 text-green-400 border border-green-500/20' : 'bg-orange-900/30 text-orange-400 border border-orange-500/20'
                        }`}>
                  <span className="material-symbols-outlined text-sm">{item.isApproved ? 'check_circle' : 'pending'}</span>
                  {item.isApproved ? 'Approved' : 'Approve'}
                </button>
                <button onClick={() => handleAction(item._id, 'isFeatured', !item.isFeatured)} 
                        className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                          item.isFeatured ? 'bg-rose text-noir' : 'bg-cream/10 text-cream border border-cream/20'
                        }`}>
                  <span className="material-symbols-outlined text-sm">star</span>
                  Feature
                </button>
                <button onClick={() => handleDelete(item._id)} 
                        className="flex-1 min-w-[80px] flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm bg-red-900/30 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && <EmptyState icon="rate_review" text={`No ${filter !== 'all' ? filter : ''} reviews`} />}
    </div>
  );
}

// Shared Components
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      {/* Animated Cake Loader - Brand Colors */}
      <motion.svg 
        width={60} 
        height={60} 
        viewBox="0 0 64 64"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cake body - brand rose */}
        <rect x="12" y="28" width="40" height="24" rx="4" fill="#e4a0a0"/>
        <rect x="16" y="20" width="32" height="12" rx="3" fill="#d4a574"/>
        
        {/* Frosting - brand gold */}
        <path d="M12 40 Q18 46 24 40 Q30 46 36 40 Q42 46 48 40 Q52 46 52 40" 
              fill="none" stroke="#d4a574" strokeWidth="3" strokeLinecap="round"/>
        
        {/* Candle */}
        <rect x="29" y="8" width="6" height="14" rx="2" fill="#d4a574"/>
        
        {/* Flame */}
        <motion.ellipse 
          cx="32" cy="5" rx="4" ry="6" 
          fill="#f5a623"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.svg>
      
      {/* Shadow */}
      <motion.div
        className="w-10 h-1.5 rounded-full"
        style={{ backgroundColor: 'rgba(228, 160, 160, 0.3)' }}
        animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-cream-muted text-sm"
      >
        Loading...
      </motion.p>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-12 text-cream-muted">
      <span className="material-symbols-outlined text-4xl sm:text-5xl mb-2 text-rose/50">{icon}</span>
      <p className="text-sm sm:text-base">{text}</p>
    </div>
  );
}

function FormModal({ title, onClose, children, wide }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-noir/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" 
                onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`card-noir w-full sm:rounded-2xl rounded-t-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto ${wide ? 'sm:max-w-lg' : 'sm:max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-1 bg-cream/20 rounded-full mx-auto sm:hidden absolute top-2 left-1/2 -translate-x-1/2" />
          <h3 className="text-lg sm:text-xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-cream/10 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-cream">close</span>
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function FormButtons({ onCancel, submitting, submitText }) {
  return (
    <div className="flex gap-2 sm:gap-3 pt-2">
      <button type="button" onClick={onCancel} 
              className="flex-1 py-2.5 border border-cream/20 rounded-lg hover:bg-cream/10 text-sm font-medium text-cream transition-colors" 
              disabled={submitting}>Cancel</button>
      <button type="submit" 
              className="flex-1 py-2.5 bg-gradient-to-r from-rose to-rose-dark text-noir rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium" 
              disabled={submitting}>
        {submitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
        {submitText}
      </button>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1 py-2 bg-cream/10 text-cream rounded-lg hover:bg-rose hover:text-noir transition-colors text-xs sm:text-sm font-medium">
        <span className="material-symbols-outlined text-base">edit</span>
        <span className="hidden xs:inline">Edit</span>
      </button>
      <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-xs sm:text-sm font-medium">
        <span className="material-symbols-outlined text-base">delete</span>
        <span className="hidden xs:inline">Delete</span>
      </button>
    </div>
  );
}

function ItemCard({ image, title, subtitle, onEdit, onDelete, aspectRatio = 'square' }) {
  return (
    <div className="card-noir rounded-xl overflow-hidden">
      <div className={`relative ${aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}>
        <Image src={image} alt={title} fill className="object-cover" unoptimized />
      </div>
      <div className="p-2.5 sm:p-3">
        <p className="text-xs sm:text-sm font-medium text-cream truncate">{title}</p>
        {subtitle && <p className="text-xs text-cream-muted mb-2 sm:mb-3">{subtitle}</p>}
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

// Admin Content Component
function AdminContent() {
  const searchParams = useSearchParams();
  const adminKey = searchParams.get('key');
  const [activeTab, setActiveTab] = useState('gallery');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (adminKey) setIsAuthorized(true);
    setChecking(false);
  }, [adminKey]);

  if (checking) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthorized || !adminKey) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center p-4">
        <div className="card-noir rounded-2xl p-6 sm:p-8 shadow-xl max-w-sm w-full text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl sm:text-6xl text-red-400">lock</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-cream mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>Access Denied</h1>
          <p className="text-cream-muted text-sm mb-4">Valid admin key required</p>
          <code className="bg-noir-light px-3 py-2 rounded-lg text-xs break-all text-rose block border border-cream/10">/admin?key=YOUR_KEY</code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="glass-strong border-b border-rose/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mini Logo */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 relative">
              <Image
                src="/logo.svg"
                alt="Cocoa&Cherry Logo"
                width={40}
                height={40}
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-rose" style={{ fontFamily: 'var(--font-cinzel)' }}>Admin Panel</h1>
              <p className="text-xs text-cream-muted hidden sm:block">Cocoa&amp;Cherry</p>
            </div>
          </div>
          <a href="/" className="flex items-center gap-1 text-xs sm:text-sm hover:opacity-80 px-3 py-1.5 rounded-lg transition-all text-gold bg-gold/10 border border-gold/20">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span className="hidden sm:inline">View Site</span>
          </a>
        </div>
      </header>

      {/* Tabs - Responsive design */}
      <div className="glass-strong border-b border-rose/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Mobile: Equal width tabs with icons */}
          <div className="flex sm:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-rose text-rose bg-rose/5' 
                    : 'border-transparent text-cream-muted hover:text-cream hover:bg-cream/5'
                }`}
              >
                <span className={`material-symbols-outlined text-xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`} 
                      style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                <span className="truncate max-w-full">{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Desktop: Horizontal tabs with icons and labels */}
          <div className="hidden sm:flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all rounded-t-lg ${
                  activeTab === tab.id 
                    ? 'border-rose text-rose bg-rose/5' 
                    : 'border-transparent text-cream-muted hover:text-cream hover:bg-cream/5'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'gallery' && <GalleryTab adminKey={adminKey} />}
        {activeTab === 'reels' && <ReelsTab adminKey={adminKey} />}
        {activeTab === 'menu' && <MenuTab adminKey={adminKey} />}
        {activeTab === 'ratelist' && <RateListTab adminKey={adminKey} />}
        {activeTab === 'reviews' && <ReviewsTab adminKey={adminKey} />}
      </main>
    </div>
  );
}

// Main Admin Page with Suspense boundary
export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-noir flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
