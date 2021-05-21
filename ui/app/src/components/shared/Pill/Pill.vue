<script>
export default {
  props: {
    color: "primary" | "info" | "danger",
    hasIcon: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { color, hasIcon } = props;
    return { classes: { [color]: true, pill: true, "has-icon": hasIcon } };
  },
};
</script>
<template>
  <div class="container">
    <div :class="classes">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
}
.pill {
  font-family: "Inter", sans-serif;
  border: 2px solid #d4b553;
  color: #d4b553;
  font-weight: 600;
  border-radius: 20px;
  padding: 0px 8px 0px 8px;
  display: inline-block;
  background: #000;
  display: flex;
}
.pill.has-icon {
  padding: 0px 8px 0px 3px;
}
.primary {
  border: 2px solid #d4b553;
  color: #d4b553;
}
.info {
  border: 2px solid #3b7fba;
  color: #3b7fba;
}
.danger {
  border: 2px solid #f05089;
  color: #f05089;
}
.success {
  border: 2px solid #97d937;
  color: #97d937;
}
</style>
