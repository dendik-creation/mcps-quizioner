import {
    TriangleAlert,
    Search,
    CircleX,
    CalendarIcon,
    ArrowDownToLine,
} from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SelectOption } from "@/types/global";
import axios from "axios";

type ErrorInputProps = {
    error: string | null;
};

export function ErrorInput({ error }: ErrorInputProps) {
    return (
        <p className="text-sm text-red-500 mt-1.5 flex items-center">
            <TriangleAlert size={16} className="me-2" />
            {error}
        </p>
    );
}
type SearchInputProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
};

export function SearchInput({
    value,
    onChange,
    placeholder = "Cari...",
    className,
}: SearchInputProps) {
    return (
        <div className={`relative w-full ${className}`}>
            <Input
                type="text"
                className="p-3"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
            />
            <Search
                className="absolute top-2.5 right-2 text-gray-500"
                size={16}
            />
        </div>
    );
}

export function SelectSearchInput({
    value,
    options,
    onChange,
    placeholder,
    removeValue,
    className,
}: {
    value: string;
    options: SelectOption[];
    onChange: (value: string | number) => void;
    placeholder?: string;
    removeValue: () => void;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "min-w-full py-1.5 justify-between relative border border-gray-300 rounded-md px-4 flex items-center cursor-pointer",
                        className
                    )}
                >
                    {value ? (
                        <span className="font-normal">
                            {
                                options.find((option) => option.value == value)
                                    ?.label
                            }
                        </span>
                    ) : (
                        <span className="font-normal text-slate-500">
                            {placeholder}
                        </span>
                    )}
                    {value != "" && value != undefined ? (
                        <span
                            className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent closing the popover
                                removeValue();
                            }}
                        >
                            <CircleX size={20} />
                        </span>
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="min-w-[400px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari pilihan..." />
                    <CommandList>
                        <CommandEmpty>Pilihan tidak ada</CommandEmpty>
                        <CommandGroup>
                            {options &&
                                options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span className="w-full">
                                            {option.label}
                                        </span>
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export const MultiSelectSearchInput = ({
    values,
    options,
    onChange,
    placeholder,
}: {
    values: string[];
    options: { label: string; value: string }[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}) => {
    const [open, setOpen] = React.useState(false);

    const toggleValue = (value: string) => {
        if (values.includes(value)) {
            onChange(values.filter((v) => v !== value));
        } else {
            onChange([...values, value]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-full h-full py-3 justify-between relative border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 flex items-center cursor-pointer"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpen(!open);
                        }
                    }}
                >
                    {values.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {values.map((val) => {
                                const label = options.find(
                                    (option) => option.value === val
                                )?.label;
                                return (
                                    <span
                                        key={val}
                                        className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
                                    >
                                        {label}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleValue(val);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <CircleX size={16} />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="font-normal text-slate-500 text-base">
                            {placeholder}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="min-w-[400px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari pilihan..." />
                    <CommandList>
                        <CommandEmpty>Pilihan tidak ada</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => toggleValue(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            values.includes(option.value)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span className="w-full">
                                        {option.label}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export function RichTextEditorInput({
    content,
    height = 200,
    onChange,
}: {
    content: string;
    height?: number;
    onChange?: (value: string) => void;
}) {
    const quillRef = useRef<ReactQuill>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previousContent, setPreviousContent] = useState(content);

    // Update previous content when content prop changes
    React.useEffect(() => {
        setPreviousContent(content);
    }, [content]);

    // Custom image handler
    const imageHandler = React.useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar (maksimal 5MB)");
                return;
            }

            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("File harus berupa gambar");
                return;
            }

            try {
                setIsUploading(true);

                // Convert file to base64
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const base64 = reader.result as string;

                        // Upload to server
                        const response = await axios.post(
                            "/admin/questionnaire/upload-image",
                            {
                                image: base64,
                                filename: `questionnaire_${Date.now()}`,
                            }
                        );

                        if (response.data?.success) {
                            const quill = quillRef.current?.getEditor();
                            if (quill) {
                                const range = quill.getSelection();
                                const index = range
                                    ? range.index
                                    : quill.getLength();

                                // Insert image with server URL
                                quill.insertEmbed(
                                    index,
                                    "image",
                                    response.data.url
                                );
                                quill.setSelection(index + 1, 0);
                            }
                        } else {
                            alert(
                                "Gagal mengupload gambar: " +
                                    (response.data?.message || "Unknown error")
                            );
                        }
                    } catch (error: any) {
                        console.error("Upload error:", error);
                        const errorMessage =
                            error.response?.data?.message ||
                            error.message ||
                            "Unknown error";
                        alert("Gagal mengupload gambar: " + errorMessage);
                    } finally {
                        setIsUploading(false);
                    }
                };

                reader.onerror = () => {
                    alert("Gagal membaca file gambar");
                    setIsUploading(false);
                };

                reader.readAsDataURL(file);
            } catch (error: any) {
                console.error("File read error:", error);
                alert("Gagal membaca file gambar");
                setIsUploading(false);
            }
        };
    }, []);

    // Extract image URLs from HTML content
    const extractImageUrls = React.useCallback((html: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const images = doc.querySelectorAll("img");
        return Array.from(images)
            .map((img) => img.src)
            .filter(
                (src) => src && src.includes("/assets/questionnaire_imgs/")
            );
    }, []);

    // Handle content change and detect image deletions
    const handleContentChange = React.useCallback(
        async (newContent: string, delta: any, source: string, editor: any) => {
            if (source === "user") {
                // Compare previous content with new content to find deleted images
                const previousImages = extractImageUrls(previousContent || "");
                const currentImages = extractImageUrls(newContent || "");

                // Find deleted images
                const deletedImages = previousImages.filter(
                    (url) => !currentImages.includes(url)
                );

                // Delete images from server (don't await to avoid blocking the UI)
                deletedImages.forEach(async (imageUrl) => {
                    try {
                        await axios.post("/admin/questionnaire/delete-image", {
                            src: imageUrl,
                        });
                    } catch (error) {
                        console.error(
                            "Failed to delete image from server:",
                            imageUrl,
                            error
                        );
                        // Silently fail - the image will remain on server but that's acceptable
                    }
                });

                // Update previous content
                setPreviousContent(newContent);
            }

            // Call the original onChange callback
            if (onChange) {
                onChange(newContent);
            }
        },
        [previousContent, onChange, extractImageUrls]
    );

    // Handle key events for better deletion detection
    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
        if (event.key === "Backspace" || event.key === "Delete") {
            const quill = quillRef.current?.getEditor();
            if (quill) {
                const selection = quill.getSelection();
                if (selection) {
                    const [blot] = quill.getLeaf(selection.index);

                    // Check if we're about to delete an image
                    if (
                        blot &&
                        blot.parent &&
                        blot.parent.domNode.tagName === "IMG"
                    ) {
                        const imgElement = blot.parent
                            .domNode as HTMLImageElement;
                        const imgSrc = imgElement.src;

                        // Schedule deletion after the content changes
                        setTimeout(async () => {
                            if (
                                imgSrc &&
                                imgSrc.includes("/assets/questionnaire_imgs/")
                            ) {
                                try {
                                    await axios.delete(
                                        "/admin/questionnaire/delete-image",
                                        {
                                            data: { src: imgSrc },
                                        }
                                    );
                                } catch (error) {
                                    console.error(
                                        "Failed to delete image from server:",
                                        imgSrc,
                                        error
                                    );
                                    // Silently fail - the image will remain on server but that's acceptable
                                }
                            }
                        }, 100);
                    }
                }
            }
        }
    }, []);

    // Attach keydown listener to quill editor
    React.useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (quill) {
            const editorElement = quill.root;
            editorElement.addEventListener("keydown", handleKeyDown);

            return () => {
                editorElement.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [handleKeyDown]);

    const modules = React.useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link", "image"],
                    [{ align: [] }],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        [imageHandler]
    );

    const formats = React.useMemo(
        () => [
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "color",
            "background",
            "align",
            "code-block",
        ],
        []
    );

    const editorStyles = React.useMemo(
        () => ({
            minHeight: `${height}px`,
        }),
        [height]
    );

    const quillStyles = React.useMemo(
        () => ({
            height: "100%",
            display: "flex",
            flexDirection: "column" as const,
        }),
        []
    );

    return (
        <div
            className="rounded-md border overflow-hidden relative"
            style={editorStyles}
        >
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content || ""}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                className="bg-white"
                style={quillStyles}
                key={`rich-editor-${height}`}
            />
            {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Mengupload gambar...</span>
                    </div>
                </div>
            )}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .ql-container {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    .ql-editor {
                        flex: 1;
                        height: auto !important;
                        min-height: ${height - 45}px;
                        max-height: ${height - 45}px;
                        overflow-y: auto;
                    }
                `,
                }}
            />
        </div>
    );
}

export const PaginatorBuilder = ({
    prevUrl,
    nextUrl,
    currentPage,
    totalPage,
}: {
    prevUrl: string;
    nextUrl: string;
    currentPage: number;
    totalPage: number;
}) => {
    return (
        <Pagination className="flex justify-end mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious size={16} href={prevUrl} />
                </PaginationItem>
                <span className="text-sm mx-2 text-gray-500">
                    Page <b>{currentPage}</b> / {totalPage}
                </span>
                <PaginationItem>
                    <PaginationNext size={16} href={nextUrl} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
