<script>
    export let modalShowBoolean;
    export let autoClose = true;
    let backgroundArea;
    
    function backgroundClickFunc(e) {
        if (e.target === backgroundArea && autoClose) {
            modalShowBoolean = false;
        }
    }
</script>

<!-- Modal content -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="myModal"
    class="modal"
    class:hidden={!modalShowBoolean}
    bind:this={backgroundArea}
    on:click={backgroundClickFunc}
>
    <!-- Modal content -->
    <div class="modal-content relative">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
            class="close absolute top-3 right-5"
            on:click={() => {
                modalShowBoolean = false;
            }}
            >&times;
        </span>

        <div class="pt-4">
            <slot>Default Button!</slot>
        </div>
        
    </div>
</div>

<style>
    .modal {
        position: fixed;
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0, 0, 0); /* Fallback color */
        background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
        padding-top: 60px;
    }

    .modal-content {
        background-color: #fefefe;
        margin: 5% auto; /* 15% from the top and centered */
        padding: 20px;
        border: 1px solid #888;
        width: 80%; /* Could be more or less, depending on screen size */
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
</style>
