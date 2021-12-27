
import sys

sys.path.append("..")

from vaa_processor import vaa_processor_program
from vaa_processor import vaa_processor_clear
from vaa_verify import vaa_verify_program

from setup import *

class TEST2(Setup):
    def __init__(self) -> None:
        super().__init__()

    def simple_test2(self):
        print("simple test2")

if __name__ == "__main__":
    test2 = TEST2()
    test2.simple_test2()
