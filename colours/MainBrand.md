# Build Canada Colours

Build Canada's main website uses a simplified, 3 primary colour system composed of a light, **Linen**, a dark, **Charcoal**, and a primary colour.

## Linen

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
    <div style="width: 80px; height: 80px; background-color: #fbf6f1; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">linen-50<br/>#fbf6f1</div>
    <div style="width: 80px; height: 80px; background-color: #f6ece3; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">linen-100<br/>#f6ece3</div>
    <div style="width: 80px; height: 80px; background-color: #ead2be; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">linen-200<br/>#ead2be</div>
    <div style="width: 80px; height: 80px; background-color: #dcb295; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">linen-300<br/>#dcb295</div>
    <div style="width: 80px; height: 80px; background-color: #cd8d6a; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">linen-400<br/>#cd8d6a</div>
    <div style="width: 80px; height: 80px; background-color: #c2724d; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">linen-500<br/>#c2724d</div>
    <div style="width: 80px; height: 80px; background-color: #b45e42; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">linen-600<br/>#b45e42</div>
    <div style="width: 80px; height: 80px; background-color: #964a38; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">linen-700<br/>#964a38</div>
    <div style="width: 80px; height: 80px; background-color: #793e33; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">linen-800<br/>#793e33</div>
    <div style="width: 80px; height: 80px; background-color: #62352c; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">linen-900<br/>#62352c</div>
    <div style="width: 80px; height: 80px; background-color: #341916; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">linen-950<br/>#341916</div>
</div>

Build Canada's main braind makes use of `*-linen-100` / `#f6ece3` as it's light tone.
Builders can pull other values to ensure their designs align with the BuildCanada brand.

```css Tailwind v4 plugin
@theme {
    --color-linen-50: #fbf6f1;
    --color-linen-100: #f6ece3;
    --color-linen-200: #ead2be;
    --color-linen-300: #dcb295;
    --color-linen-400: #cd8d6a;
    --color-linen-500: #c2724d;
    --color-linen-600: #b45e42;
    --color-linen-700: #964a38;
    --color-linen-800: #793e33;
    --color-linen-900: #62352c;
    --color-linen-950: #341916;
}
```

```jsx Usage
export default function Page(props) {
    return <main className="bg-linen-100">{props.children}</main>
}
```

## Charcoal

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
    <div style="width: 80px; height: 80px; background-color: #f6f6f6; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">charcoal-50<br/>#f6f6f6</div>
    <div style="width: 80px; height: 80px; background-color: #e7e7e7; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">charcoal-100<br/>#e7e7e7</div>
    <div style="width: 80px; height: 80px; background-color: #d1d1d1; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">charcoal-200<br/>#d1d1d1</div>
    <div style="width: 80px; height: 80px; background-color: #b0b0b0; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">charcoal-300<br/>#b0b0b0</div>
    <div style="width: 80px; height: 80px; background-color: #888888; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">charcoal-400<br/>#888888</div>
    <div style="width: 80px; height: 80px; background-color: #6d6d6d; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-500<br/>#6d6d6d</div>
    <div style="width: 80px; height: 80px; background-color: #5d5d5d; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-600<br/>#5d5d5d</div>
    <div style="width: 80px; height: 80px; background-color: #4f4f4f; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-700<br/>#4f4f4f</div>
    <div style="width: 80px; height: 80px; background-color: #454545; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-800<br/>#454545</div>
    <div style="width: 80px; height: 80px; background-color: #3d3d3d; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-900<br/>#3d3d3d</div>
    <div style="width: 80px; height: 80px; background-color: #272727; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-1000<br/>#272727</div>
    <div style="width: 80px; height: 80px; background-color: #141414; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">charcoal-1050<br/>#141414</div>
</div>

Build Canada's main braind makes use of `*-charcoal-1000` / `#272727` as it's dark tone.
Builders can pull other values from this list to ensure their designs align with the BuildCanada brand.


```css Tailwind v4 plugin
@theme {
    --color-charcoal-50: #f6f6f6;
    --color-charcoal-100: #e7e7e7;
    --color-charcoal-200: #d1d1d1;
    --color-charcoal-300: #b0b0b0;
    --color-charcoal-400: #888888;
    --color-charcoal-500: #6d6d6d;
    --color-charcoal-600: #5d5d5d;
    --color-charcoal-700: #4f4f4f;
    --color-charcoal-800: #454545;
    --color-charcoal-900: #3d3d3d;
    --color-charcoal-1000: #272727;
    --color-charcoal-1050: #141414;
}
```

```jsx Usage
export default function Page(props) {
    return <main className="bg-linen-100 text-charcoal-950">{props.children}</main>
}
```

## Primary (Canada Red)

<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
    <div style="width: 80px; height: 80px; background-color: #fcf4f4; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">canada-red-50<br/>#fcf4f4</div>
    <div style="width: 80px; height: 80px; background-color: #fae6e6; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">canada-red-100<br/>#fae6e6</div>
    <div style="width: 80px; height: 80px; background-color: #f7d1d1; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">canada-red-200<br/>#f7d1d1</div>
    <div style="width: 80px; height: 80px; background-color: #f1b0b0; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">canada-red-300<br/>#f1b0b0</div>
    <div style="width: 80px; height: 80px; background-color: #e68383; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #333;">canada-red-400<br/>#e68383</div>
    <div style="width: 80px; height: 80px; background-color: #d85b5b; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">canada-red-500<br/>#d85b5b</div>
    <div style="width: 80px; height: 80px; background-color: #c43e3e; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">canada-red-600<br/>#c43e3e</div>
    <div style="width: 80px; height: 80px; background-color: #a43131; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">canada-red-700<br/>#a43131</div>
    <div style="width: 80px; height: 80px; background-color: #932f2f; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">canada-red-800<br/>#932f2f</div>
    <div style="width: 80px; height: 80px; background-color: #722a2a; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">canada-red-900<br/>#722a2a</div>
    <div style="width: 80px; height: 80px; background-color: #3d1212; border: 1px solid #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.7em; text-align: center; color: #eee;">canada-red-950<br/>#3d1212</div>
</div>

Build Canada's main braind makes use of `*-canada-red-800` / `#932f2f` as it's primary colour.
Builders can pull other values from this list to ensure their designs align with the BuildCanada brand.

```css Tailwind v4 plugin
@theme {
    --color-canada-red-50: #fcf4f4;
    --color-canada-red-100: #fae6e6;
    --color-canada-red-200: #f7d1d1;
    --color-canada-red-300: #f1b0b0;
    --color-canada-red-400: #e68383;
    --color-canada-red-500: #d85b5b;
    --color-canada-red-600: #c43e3e;
    --color-canada-red-700: #a43131;
    --color-canada-red-800: #932f2f;
    --color-canada-red-900: #722a2a;
    --color-canada-red-950: #3d1212;
}
```

```jsx Usage
export default function Page(props) {
    return <main className="bg-linen-100 text-charcoal-950">
        <button className="bg-canada-red-800 text-linen-100 hover:bg-canada-red-600">Join Build Canada</button>
        {props.children}
    </main>
}
```