from operator import index
import os

path = "../src"
counter = 0


for dir in ["App", "components", "pages"]:
    dir_path = os.path.join(path, dir)

    for cmp in os.listdir(dir_path):
        cmp_path = os.path.join(dir_path, cmp)
        print(cmp_path)

        if os.path.isdir(cmp_path):
            print(os.listdir(cmp_path))
            index_path = os.path.join(cmp_path, "index.tsx")
            style_path = os.path.join(cmp_path, "style.scss")

            if os.path.exists(index_path):
                # new_name = os.path.join(cmp_path, f"{cmp}.tsx")
                # os.rename(index_path, new_name)

                new_name = os.path.join(cmp_path, f"index.ts")
                os.rename(index_path, new_name)

                # with open(index_path, "w") as index_file:
                #     if os.path.exists(style_path):
                #         counter += 1
                #         index_file.write(f'import "./style.scss";\n\n')

                #     index_file.write(f'export * from "./{cmp}";\n')
                #     index_file.write(f'export {{ default }} from "./{cmp}";\n')

            for sub_cmp in os.listdir(cmp_path):
                sub_cmp_path = os.path.join(cmp_path, sub_cmp)
                print(sub_cmp_path)

                if os.path.isdir(sub_cmp_path):
                    print(os.listdir(sub_cmp_path))
                    index_path = os.path.join(sub_cmp_path, "index.tsx")
                    style_path = os.path.join(sub_cmp_path, "style.scss")

                    if os.path.exists(index_path):
                        # new_name = os.path.join(sub_cmp_path, f"{sub_cmp}.tsx")
                        # os.rename(index_path, new_name)

                        new_name = os.path.join(sub_cmp_path, f"index.ts")
                        os.rename(index_path, new_name)

                        # with open(index_path, "w") as index_file:
                        #     if os.path.exists(style_path):
                        #         counter += 1
                        #         index_file.write(f'import "./style.scss";\n\n')

                        #     index_file.write(f'export * from "./{sub_cmp}";\n')
                        #     index_file.write(
                        #         f'export {{ default }} from "./{sub_cmp}";\n'
                        #     )

print(counter)
